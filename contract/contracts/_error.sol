// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

error Unauthorized();
error TooEarly(uint256 time);
error TooLate(uint256 time);
error PriceNotMet(uint256 price, uint256 amount);
error PoolNotActive(string message,bytes32 poolId, uint256 endTime, uint256 now);