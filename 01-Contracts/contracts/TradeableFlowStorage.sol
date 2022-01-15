//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {
    ISuperfluid,
    ISuperToken
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

import {
    IConstantFlowAgreementV1
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

library TradeableFlowStorage  {

    struct EmployeeProfile {
        uint256 tokenId;
        address employer;
        bool locOpen;
        uint256 availableCredit;
        int96 incomeInflowRate;                          // Track how much borrowers are getting paid
        uint256 interestOutflowRate;                       // Track how much borrower is paying in interest 
                                                           // Getting remaining amount needed to stream to Bob is just income less interest
    }

    struct EmployerProfile {
        mapping(address => bool) activeEmployees;          // Mapping of the employer's employee address to whether they're active employees
        bool authorized;                                   // Whehter the employer has been authorized by owner or not
    }

    struct SuperCardProgram {
        address owner;                                     // Program owner
        ISuperfluid host;                                  // Superfluid host contract
        IConstantFlowAgreementV1 cfa;                      // The stored constant flow agreement class address

        int96 interestRate;                                // Number out of 100, so 30% APR is 30
        uint256 locAmount;                                 // Amount borrowers may borrow (in future, this will be relative to incomeInflowRate)
        IERC20 lendingToken;                              // Token being used for lending
        ISuperToken paymentToken;                          // Token used by employers for payment
        mapping(address => EmployerProfile) employers;     // Mapping of employers to their struct details
        mapping(address => EmployeeProfile) employees;     // Mapping of borrowers to their struct details
        mapping(uint256 => address) tokenIdToEmployee;     // Mapping of token ID to address of employee getting income from token
        
    }

    // Storage struct used to avoid stack too deep error
    struct TempContextData {
        bytes agreementData;
        bytes ctx;
    }


}