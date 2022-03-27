// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0;

import "./Type.sol";

contract Session {
    address parentContract;
    string name;
    string description;
    string[] images;
    uint256 proposePrice;
    uint256 timeout;
    uint256 reward;
    uint256 initTime;
    uint256 finalPrice;

    ParticipantPropose[] proposeList;
    uint256 proposeIndex;
    mapping(address => ParticipantPropose) proposeMap;

    SessionState state;

    modifier onlyParentContract() {
        require(msg.sender == parentContract, "Only parent contract is allow");
        _;
    }

    constructor(
        address _parentContract,
        string memory _name,
        string memory _description,
        string[] memory _images,
        uint256 _timeout,
        uint256 _reward
    ) payable {
        parentContract = _parentContract;
        state = SessionState.OnGoing;
        name = _name;
        description = _description;
        reward = _reward;
        images = _images;
        timeout = _timeout;
        initTime = block.timestamp;
    }

    function close() public onlyParentContract {
        state = SessionState.Closed;
        calculateProposePrice();
    }

    function isClosed() public view returns (bool) {
        return
            state == SessionState.Closed ||
            (timeout != 0 && (initTime + timeout) > block.timestamp);
    }

    function update(
        string memory _name,
        string memory _description,
        string[] memory _images
    ) public onlyParentContract {
        name = _name;
        description = _description;
        images = _images;
    }

    function setFinalPrice(uint256 _finalPrice) public onlyParentContract {
        finalPrice = _finalPrice;
        uint256 i;

        // update deviation of each participant that has join this session.
        for (i = 0; i < proposeIndex; i++) {
            ParticipantPropose memory proposeInfo = proposeList[i];
            address currentParticipant = proposeInfo.participantAddress;
            (
                uint256 currentDeviation,
                uint256 sessionsCount
            ) = getParticpantInfo(currentParticipant);

            uint256 newDeviation = ((subAbs(_finalPrice, proposeInfo.price) *
                100) / _finalPrice);
            uint256 updatedDeviation = ((currentDeviation * sessionsCount) +
                newDeviation) / (sessionsCount + 1);
            IMain(parentContract).updateParticipantDeviation(
                currentParticipant,
                updatedDeviation
            );
        }
    }

    function submitPrice(address _participantAddr, uint256 _price)
        public
        onlyParentContract
    {
        if (proposeMap[_participantAddr].participantAddress == address(0)) {
            // new participant
            ParticipantPropose memory propose = ParticipantPropose(
                _participantAddr,
                _price,
                proposeIndex
            );
            proposeList.push(propose);
            proposeMap[_participantAddr] = propose;
            proposeIndex++;
            IMain(parentContract).increaseParticipantSessionCount(
                _participantAddr
            );
        } else {
            //  existed participant
            proposeMap[_participantAddr].price = _price;
            proposeList[proposeMap[_participantAddr].index].price = _price;
        }
    }

    function getParticpantInfo(address _participantAddr)
        internal
        returns (uint256, uint256)
    {
        Participant memory participant = IMain(parentContract)
            .getParticipantDetail(_participantAddr);
        return (participant.deviation, participant.sessionsCount);
    }

    function getInfo()
        public
        view
        returns (
            string memory,
            string memory,
            string[] memory,
            uint256,
            SessionState,
            uint256,
            uint256,
            ParticipantPropose[] memory
        )
    {
        return (
            name,
            description,
            images,
            timeout,
            state,
            proposePrice,
            finalPrice,
            proposeList
        );
    }

    function getProposePrice() public view returns (uint256) {
        return proposePrice;
    }

    // internal function

    function subAbs(uint256 a, uint256 b) internal pure returns (uint256) {
        return a >= b ? a - b : b - a;
    }

    function calculateProposePrice() internal {
        uint256 i;

        if (proposeIndex == 0) {
            proposePrice = 0;
        } else {
            uint256 totalDeviation;
            uint256 topValue;

            for (i = 0; i < proposeIndex; i++) {
                ParticipantPropose memory proposeInfo = proposeList[i];
                address currentParticipant = proposeInfo.participantAddress;
                (uint256 deviation, ) = getParticpantInfo(currentParticipant);
                totalDeviation += deviation;
                topValue += (proposeInfo.price * (100 - deviation));
            }

            proposePrice = topValue / ((100 * proposeIndex) - totalDeviation);
        }
    }
}
