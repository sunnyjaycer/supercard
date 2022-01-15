//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
pragma abicoder v2;

import "hardhat/console.sol";

import {RedirectAll, ISuperToken, IConstantFlowAgreementV1, ISuperfluid} from "./RedirectAll.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./TradeableFlowStorage.sol";

// Ideas:
// - make LOC size relative to income rate

contract TradeableFlow is ERC721, ERC721URIStorage, RedirectAll {

    using Strings for uint256;                                                    // clever package which lets you cast uints to strings
    using Counters for Counters.Counter;
    Counters.Counter tokenIds;

    string public baseURI;
    string public cid;


    constructor (
        address _owner,
        string memory _name,
        string memory _symbol,
        string memory _baseURI,
        // string memory _cid,
        ISuperToken _paymentToken,
        IERC20 _lendingToken,              // Stablecoin that will be lent out on LOCs
        int96 _interestRate,               // Number between 100 and 200, so 30% APR is 130
        uint256 _locAmount,
        ISuperfluid host,
        IConstantFlowAgreementV1 cfa,
        string memory registrationKey
    )
        public ERC721 ( _name, _symbol )
        RedirectAll (
        host,
        cfa,
        _owner,
        registrationKey
        )
    { 
        _scp.owner = _owner;
        _scp.paymentToken = _paymentToken;
        _scp.lendingToken = _lendingToken;
        _scp.interestRate = _interestRate;
        _scp.locAmount = _locAmount;
        baseURI = _baseURI;
        // cid = _cid;
    }

    function mint() public returns (uint256 tokenId) {
        // require employer registered the employee under them
        require(_scp.employees[msg.sender].employer != address(0), "!employed");

        // Increment token ID
        tokenIds.increment();
        tokenId = tokenIds.current();

        _mint(msg.sender,tokenId);

        // set the token ID for the employee (msg.sender)
        _scp.tokenIdToEmployee[tokenId] = msg.sender;
        _scp.employees[msg.sender].tokenId = tokenId;
        

    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721) {
        require(to != _scp.owner,"!own");

        //this should be added
        super._beforeTokenTransfer(from, to, tokenId);

        if (from != address(0)) {
            _changeReceiver(from, to, tokenId);
        }
    }

    // Employee "stakes" their income and can now borrow
    function openLoc() public {
        // Employee must have minted supercard
        require(_scp.employees[msg.sender].tokenId != 0, "!mintedSC");
        
        _scp.employees[msg.sender].locOpen = true;
        _scp.employees[msg.sender].availableCredit = _scp.locAmount;
    }

    function closeLoc() public {
        require(_scp.employees[msg.sender].availableCredit)

    }

    function changeEmployerRegistration(address employer) public {
        // allows an employer to open an income stream and set registered employees
        require(msg.sender == _scp.owner,"!owner");
        
        _scp.employers[employer].authorized = !_scp.employers[employer].authorized;
    }
    
    // lets an employer sets an employee under him
    function registerEmployee(address employee) public {
        require(_scp.employers[msg.sender].authorized,"!registeredEmployer");
        // Sets employee to active in EmployerProfile
        _scp.employers[msg.sender].activeEmployees[employee] = true;
        // Sets employer in EmployeeProfile
        _scp.employees[employee].employer = msg.sender;

    }

    // TODO: conso requires
    function borrow(uint256 borrowAmount) public {
        // Caller must have SuperCard minted
        require(_scp.employees[msg.sender].tokenId != 0, "!mintedSC");
        // Caller must locOpen
        require(_scp.employees[msg.sender].locOpen, "!openLoc");
        // Caller must be employed
        require(_scp.employees[msg.sender].employer != address(0), "!employed");
        // Caller must have an imcome coming through
        require(_scp.employees[msg.sender].incomeInflowRate != 0, "!income");
        // Amount can't be greater than available LOC
        require(borrowAmount <= _scp.locAmount, "!borrowTooMuch");

        // calculate repayment rate
        // repayment rate is such that principle will be repayed over 3 months plus interest reframed to that 3-month timeframe
        int96 repaymentRate =  int96( ( int( uint( borrowAmount ) ) * (_scp.interestRate) / ( 100000 * 3 ) ) / ( 30 * 24 * 60 * 60 ) );

        // modify existing flow to employee
        (,int96 currentFlowToemployee,,) = _scp.cfa.getFlow(_scp.paymentToken, address(this), msg.sender);
        _updateFlow(msg.sender, currentFlowToemployee - repaymentRate,_scp.paymentToken);

        // Start repayment flow to program owner
        _createFlow(_scp.owner, repaymentRate, _scp.paymentToken);

        // Borrow Amount
        IERC20(_scp.lendingToken).transfer(msg.sender, borrowAmount);

        // Update availableLoc amount
        _scp.employees[msg.sender].availableCredit -= borrowAmount;
    }

    function repay(uint256 repayAmount) public {
        // Caller must be employed
        require(_scp.employees[msg.sender].employer != address(0), "!employed");

    }

    function setCID(string memory newCID) public {
        cid = newCID;
    }

    function getTokenIdFromEmployee(address employee) public view returns (uint256) {
        return _scp.employees[employee].tokenId;
    }

    /**
    @dev overriding _burn due duplication in inherited ERC721 and ERC721URIStorage
    */
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function _baseURI() internal view virtual override(ERC721) returns (string memory) {
        return baseURI;
    }

        
    /**
    @notice Overrides tokenURI
    @param tokenId token ID of Drip NFT being queried
    @return token URI
    */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        require(_exists(tokenId),"!exist");
        if (bytes(_baseURI()).length > 0) {
            return string(
                abi.encodePacked(
                _baseURI(),
                cid
                )
            );
        } else {
            return "";
        }
    }

}