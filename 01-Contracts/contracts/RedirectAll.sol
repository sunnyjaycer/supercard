//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
pragma abicoder v2;

import "hardhat/console.sol";

import {
    ISuperfluid,
    ISuperToken,
    ISuperApp,
    ISuperAgreement,
    SuperAppDefinitions
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

import {
    IConstantFlowAgreementV1
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";

import {
    SuperAppBase
} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";

import "./TradeableFlowStorage.sol";

contract RedirectAll is SuperAppBase {

    TradeableFlowStorage.SuperCardProgram internal _scp;
    TradeableFlowStorage.TempContextData internal _tcd;

    constructor(
        ISuperfluid host,
        IConstantFlowAgreementV1 cfa,
        address owner,
        string memory registrationKey
        ) {
        require(address(host) != address(0), "host");
        require(address(cfa) != address(0), "cfa");
        require(address(owner) != address(0), "owner");
        require(!host.isApp(ISuperApp(owner)), "owner SA");

        _scp.host = host;
        _scp.cfa = cfa;
        _scp.owner = owner;

        uint256 configWord =
            SuperAppDefinitions.APP_LEVEL_FINAL |
            SuperAppDefinitions.BEFORE_AGREEMENT_CREATED_NOOP |
            SuperAppDefinitions.BEFORE_AGREEMENT_UPDATED_NOOP |
            SuperAppDefinitions.BEFORE_AGREEMENT_TERMINATED_NOOP;

        // _scp.host.registerApp(configWord);
        if(bytes(registrationKey).length > 0) {
            _scp.host.registerAppWithKey(configWord, registrationKey);
        } else {
            _scp.host.registerApp(configWord);
        }
    }

    // To be eligible for income:
    // 1. Employer must have been registered by SuperCard program owner
    // 2. Employer must have registerEmployee()
    // 3. Registered employee must have minted SuperCard
    // Now employer may start paying employee
    function _createOutflow(ISuperToken supertoken) internal returns (bytes memory newCtx) {
        newCtx = _tcd.ctx;
        // Get employer (flow starter) from agreementData
        (address employer, ) = abi.decode(_tcd.agreementData, (address, address));
        // 1. require creator is an authorized employer
        require(_scp.employers[employer].authorized,"!authorizedEmployer");
        // Get user data from context (employee) - because of this, the createFlow must be done with userData specified or it will revert
        // address employee = abi.decode(_scp.host.decodeCtx(newCtx).userData, (address));
        uint256 tokenId = abi.decode(_scp.host.decodeCtx(newCtx).userData, (uint256));
        address employee = _scp.tokenIdToEmployee[tokenId];
        // 2. require target employee is under employer
        require(_scp.employers[employer].activeEmployees[employee],"!activeEmployee");
        // 3. require that target employee has actually minted SuperCard
        require( _scp.employees[employee].tokenId != 0, "!mintedSC" );


        // Get how much employer is streaming to the app as income
        (,int96 currentEmployerFlow,,) = _scp.cfa.getFlow(supertoken, employer, address(this));
        // Open flow with that same amount to the first employee
        newCtx = _createFlow(employee,currentEmployerFlow,supertoken,newCtx);
        // Set the employee's income rate to what the employer is now providing
        _scp.employees[employee].incomeInflowRate = currentEmployerFlow;
        

    }


    function _updateOutflow(ISuperToken supertoken) internal returns (bytes memory newCtx) {
        newCtx = _tcd.ctx;
        // Get employer (flow starter) from agreementData
        (address employer, ) = abi.decode(_tcd.agreementData, (address, address));
        // iterate across all of the employer's employees and cancel outbound streams, set employees to inactive
        // Get user data from context (employee) - because of this, the createFlow must be done with userData specified or it will revert
        // address employee = abi.decode(_scp.host.decodeCtx(newCtx).userData, (address));
        uint256 tokenId = abi.decode(_scp.host.decodeCtx(newCtx).userData, (uint256));

        // Get employee behind token ID
        address employee = _scp.tokenIdToEmployee[tokenId];

        // Change flow to employee by rate adjustment delta
        (,int96 currentEmployerFlow,,) = _scp.cfa.getFlow(supertoken, employer, address(this));
        (,int96 currentEmployeeFlow,,) = _scp.cfa.getFlow(supertoken, address(this), employee);
        int96 rateDelta = currentEmployerFlow - _scp.employees[employee].incomeInflowRate;
        newCtx = _updateFlow(employee, currentEmployeeFlow + rateDelta,_scp.paymentToken, newCtx);

        _scp.employees[employee].incomeInflowRate += rateDelta;

    }


    function _deleteOutflow(ISuperToken supertoken) internal returns (bytes memory newCtx) {
        newCtx = _tcd.ctx;
        // Get employer (flow starter) from agreementData
        (address employer, ) = abi.decode(_tcd.agreementData, (address, address));


        for (uint i=0; i<_scp.employers[employer].employeeList.length; i++) {
            address employee = _scp.employers[employer].employeeList[i];

            // Delete flow to employee
            (,int96 currentFlowToEmployee,,) = _scp.cfa.getFlow(supertoken, address(this), employee);
            if ( currentFlowToEmployee != 0 ) {
                newCtx = _deleteFlow(address(this), employee, _scp.paymentToken, newCtx);
            }

            // if employee has active interest payment going on, cancel it
            (,int96 currentTotalInterestFlow,,) = _scp.cfa.getFlow(supertoken, address(this), _scp.owner);
            console.logInt(currentTotalInterestFlow);
            if ( _scp.employees[employee].interestOutflowRate != 0) {
                // If reducing by this flow brings it to zero, do a deleteFlow
                if ( currentTotalInterestFlow - _scp.employees[employee].interestOutflowRate == 0 ) {
                    newCtx = _deleteFlow(address(this), _scp.owner, _scp.paymentToken, newCtx);
                } else {
                    newCtx = _updateFlow(_scp.owner, currentTotalInterestFlow - _scp.employees[employee].interestOutflowRate, _scp.paymentToken, newCtx);
                }
            }

            // delete each employee in employees
            delete _scp.employees[employee];

            // set employee in activeEmployees to false
            _scp.employers[employer].activeEmployees[employee] = false;

            // set employer to authorized to false
            _scp.employers[employer].authorized = false;
            
        }

        // delete employer from employers
        delete _scp.employers[employer];

    }


    function _changeReceiver( address oldEmployee, address newEmployee, uint tokenId ) internal {
        // === DATA CHANGES ===
        // change activeEmployees for the employer that the oldEmployee is under (turn off old one, turn on new one)
        address employer = _scp.employees[oldEmployee].employer;
        _scp.employers[employer].activeEmployees[oldEmployee] = false;
        _scp.employers[employer].activeEmployees[newEmployee] = true;
        // Add newEmployee to employer employeeList. The old employee will remain, but lack of flow will be accounted for in _deleteOutflow hook
        _scp.employers[employer].employeeList.push(newEmployee);
        // make a new employee profile based on the previous one
        _scp.employees[newEmployee] = _scp.employees[oldEmployee];

        
        
        // delete the old employee profile
        delete _scp.employees[oldEmployee];
        // change tokenIdToEmployee
        _scp.tokenIdToEmployee[tokenId] = newEmployee;

        // === FLOW CHANGES ===
        // Get flow rate to old employee
        (,int96 oldEmployeeOutflow,,) = _scp.cfa.getFlow(_scp.paymentToken, address(this), oldEmployee);
        // delete flow to oldEmployee
        _deleteFlow(address(this), oldEmployee, _scp.paymentToken);
        // start flow to newEmployee equal to old flow rate
        _createFlow(newEmployee, oldEmployeeOutflow, _scp.paymentToken);
    }



    function afterAgreementCreated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32, // _agreementId,
        bytes calldata _agreementData,
        bytes calldata ,// _cbdata,
        bytes calldata _ctx
    )
        external override
        onlyExpected(_superToken, _agreementClass)
        onlyHost
        returns (bytes memory newCtx)
    {

        _tcd.agreementData = _agreementData;
        _tcd.ctx = _ctx;

        return _createOutflow(_superToken);

    }


    function afterAgreementUpdated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32 ,//_agreementId,
        bytes calldata _agreementData,
        bytes calldata ,//_cbdata,
        bytes calldata _ctx
    )
        external override
        onlyExpected(_superToken, _agreementClass)
        onlyHost
        returns (bytes memory newCtx)
    {

        _tcd.agreementData = _agreementData;
        _tcd.ctx = _ctx;

        return _updateOutflow(_superToken);

    }


    function afterAgreementTerminated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32 ,//_agreementId,
        bytes calldata _agreementData,
        bytes calldata ,//_cbdata,
        bytes calldata _ctx
    )
        external override
        onlyHost
        returns (bytes memory newCtx)
    {

        _tcd.agreementData = _agreementData;
        _tcd.ctx = _ctx;

        return _deleteOutflow(_superToken);

    }


    function _isValidToken(ISuperToken superToken) private view returns (bool) {
        return _scp.paymentToken == superToken;
    }

    function _isCFAv1(address agreementClass) private view returns (bool) {
        return ISuperAgreement(agreementClass).agreementType()
            == keccak256("org.superfluid-finance.agreements.ConstantFlowAgreement.v1");
    }

    modifier onlyHost() {
        require(msg.sender == address(_scp.host), "RedirectAll: support only one host");
        _;
    }


    modifier onlyExpected(ISuperToken superToken, address agreementClass) {
        require(_isValidToken(superToken), "RedirectAll: not accepted token");
        require(_isCFAv1(agreementClass), "RedirectAll: only CFAv1 supported");
        _;
    }

    function _createFlow(
        address to,
        int96 flowRate,
        ISuperToken _superToken,
        bytes memory ctx
    ) internal returns (bytes memory newCtx) {
        (newCtx, ) = _scp.host.callAgreementWithContext(
            _scp.cfa,
            abi.encodeWithSelector(
                _scp.cfa.createFlow.selector,
                _superToken,
                to,
                flowRate,
                new bytes(0) // placeholder
            ),
            "0x",
            ctx
        );
    }

    function _createFlow(address to, int96 flowRate, ISuperToken _superToken) internal {
       _scp.host.callAgreement(
           _scp.cfa,
           abi.encodeWithSelector(
               _scp.cfa.createFlow.selector,
               _superToken,
               to,
               flowRate,
               new bytes(0) // placeholder
           ),
           "0x"
       );
    }

    function _updateFlow(
        address to,
        int96 flowRate,
        ISuperToken _superToken,
        bytes memory ctx
    ) internal returns (bytes memory newCtx) {
        (newCtx, ) = _scp.host.callAgreementWithContext(
            _scp.cfa,
            abi.encodeWithSelector(
                _scp.cfa.updateFlow.selector,
                _superToken,
                to,
                flowRate,
                new bytes(0) // placeholder
            ),
            "0x",
            ctx
        );
    }

    function _updateFlow(address to, int96 flowRate, ISuperToken _superToken) internal {
        _scp.host.callAgreement(
            _scp.cfa,
            abi.encodeWithSelector(
                _scp.cfa.updateFlow.selector,
                _superToken,
                to,
                flowRate,
                new bytes(0) // placeholder
            ),
            "0x"
        );
    }

    function _deleteFlow(
        address from,
        address to,
        ISuperToken _superToken,
        bytes memory ctx
    ) internal returns (bytes memory newCtx) {
        (newCtx, ) = _scp.host.callAgreementWithContext(
            _scp.cfa,
            abi.encodeWithSelector(
                _scp.cfa.deleteFlow.selector,
                _superToken,
                from,
                to,
                new bytes(0) // placeholder
            ),
            "0x",
            ctx
        );
    }

    function _deleteFlow(address from, address to, ISuperToken _superToken) internal {
        _scp.host.callAgreement(
            _scp.cfa,
            abi.encodeWithSelector(
                _scp.cfa.deleteFlow.selector,
                _superToken,
                from,
                to,
                new bytes(0) // placeholder
            ),
            "0x"
        );
    }

}