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

enum SessionState {
    OnGoing,
    Closed
}

struct SessionInfo {
    uint256 id;
    string name;
    string description;
    string[] images;
    uint256 timeout;
    SessionState state;
    uint256 proposePrice;
    uint256 finalPrice;
}

// Interface of Main contract to call from Session contract
interface IMain {
    function getParticipantDetail(address _session)
        external
        returns (Participant memory);

    function updateParticipantDeviation(
        address _participantAddr,
        uint256 _deviation
    ) external;

    function increaseParticipantSessionCount(address _participantAddr) external;
}
