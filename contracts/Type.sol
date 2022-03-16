// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0;

struct Participant {
    string email;
    string name;
    address account;
    uint256 deviation;
    uint256 sessionsCount;
    uint256 index;
}

struct ParticipantPropose {
    address participantAddress;
    uint256 price;
    uint256 index;
}