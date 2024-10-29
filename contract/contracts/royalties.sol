// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Dis {
    uint256 royalties = 10;

    constructor() {}

    function sendFund() public payable {}

    function distrubute() public view returns (uint256) {
        return ((3000000000000000000 * 10) / 100);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    receive() external payable {}

    fallback() external payable {}
}