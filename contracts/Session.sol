// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0;

import "./Type.sol";

// Interface of Main contract to call from Session contract
interface IMain {
    function getParticipantDetail(address _session)
        external
        returns (Participant memory);

    function updateParticipantDeviation(address _account, uint256 _deviation)
        external;

    function increaseParticipantSessionCount(address _account) external;
}

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
    uint256 proposeIndex = 0;
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

    function isClosed() public view onlyParentContract returns (bool) {
        return
            (state == SessionState.Closed) ||
            (initTime + timeout) > block.timestamp;
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

    function updateFinalPrice(uint256 _finalPrice) public onlyParentContract {
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

            uint256 newDeviation = (abs(
                int256(_finalPrice - proposeInfo.price)
            ) / _finalPrice) * 100;
            uint256 updatedDeviation = ((currentDeviation * sessionsCount) +
                newDeviation) / (sessionsCount + 1);
            IMain(parentContract).updateParticipantDeviation(
                currentParticipant,
                updatedDeviation
            );
        }
    }

    function submitPrice(address _participant, uint256 _price)
        public
        onlyParentContract
    {
        if (proposeMap[_participant].participantAddress == address(0)) {
            // new participant
            ParticipantPropose memory propose = ParticipantPropose(
                _participant,
                _price,
                proposeIndex
            );
            proposeList.push(propose);
            proposeMap[_participant] = propose;
            proposeIndex++;
            IMain(parentContract).increaseParticipantSessionCount(_participant);
        } else {
            //  existed participant
            proposeMap[_participant].price = _price;
        }
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

            // proposePrice = 1;
            proposePrice = topValue / ((100 * proposeIndex) - totalDeviation);
        }
    }

    function getParticpantInfo(address _account)
        public
        returns (uint256, uint256)
    {
        Participant memory participant = IMain(parentContract)
            .getParticipantDetail(_account);
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
            uint256
        )
    {
        return (
            name,
            description,
            images,
            timeout,
            state,
            proposePrice,
            finalPrice
        );
    }

    function getProposePrice() public view returns (uint256) {
        return proposePrice;
    }

    function abs(int256 x) private pure returns (uint256) {
        return x >= 0 ? uint256(x) : uint256(-x);
    }

    function testCross(address _account) public returns (uint256, uint256) {
        Participant memory participant = IMain(parentContract)
            .getParticipantDetail(_account);
        return (participant.deviation, participant.sessionsCount);
    }
}
