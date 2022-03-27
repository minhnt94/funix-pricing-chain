// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0;

import "./Session.sol";
import "./Admin.sol";
import "./Type.sol";

contract Main is Admin {
    Session[] private sessionList;
    mapping(uint256 => Session) private sessionMap;
    uint256 sessionIndex = 0;

    Participant[] private participantList;
    mapping(address => Participant) private participantMap;
    uint256 participantIndex = 0;

    modifier isParticipant() {
        require(isSignIn(msg.sender), "Not allowed cause not signed in");
        _;
    }

    constructor() {}

    function initSession(
        string memory _name,
        string memory _description,
        string[] memory _images,
        uint256 _timeout
    ) public payable isAdmin {
        Session session = new Session(
            address(this),
            _name,
            _description,
            _images,
            _timeout,
            msg.value
        );
        sessionList.push(session);
        sessionMap[sessionIndex] = session;
        sessionIndex++;
    }

    function closeSession(uint256 _sessionIndex) public isAdmin {
        sessionList[_sessionIndex].close();
    }

    function setFinalPrice(uint256 _sessionIndex, uint256 _finalPrice)
        public
        isAdmin
    {
        sessionList[_sessionIndex].setFinalPrice(_finalPrice);
    }

    function getSessions() public view returns (SessionInfo[] memory) {
        uint256 i;
        SessionInfo[] memory result = new SessionInfo[](sessionIndex);

        for (i = 0; i < sessionIndex; i++) {
            Session currentSession = sessionList[i];
            (
                string memory name,
                string memory description,
                string[] memory images,
                uint256 timeout,
                SessionState state,
                uint256 proposePrice,
                uint256 finalPrice
            ) = currentSession.getInfo();
            SessionInfo memory info = SessionInfo(
                i,
                name,
                description,
                images,
                timeout,
                state,
                proposePrice,
                finalPrice
            );
            result[i] = info;
        }

        return result;
    }

    function updateSession(
        uint256 _sessionIndex,
        string memory _name,
        string memory _description,
        string[] memory _images
    ) public isAdmin {
        sessionList[_sessionIndex].update(_name, _description, _images);
    }

    function submitPrice(uint256 _sessionIndex, uint256 _price)
        public
        isParticipant
    {
        require(
            sessionList[_sessionIndex].isClosed() == false,
            "Session is closed."
        );
        //require session is not closed.

        sessionList[_sessionIndex].submitPrice(msg.sender, _price);
    }

    function getSessionProposePrice(uint256 _sessionIndex) public view returns (uint256) {
        return  sessionList[_sessionIndex].getProposePrice();
    }

    function getParticipantList() public view isAdmin returns (Participant[] memory) {
        return participantList;
    }

    function register(string memory _email, string memory _name) public {
        Participant memory participant = Participant(
            _email,
            _name,
            msg.sender,
            0,
            0,
            participantIndex
        );
        participantList.push(participant);
        participantMap[msg.sender] = participant;
        participantIndex++;
    }

    function getParticipantDetail(address _participantAddr)
        public
        view
        returns (Participant memory)
    {
        return participantMap[_participantAddr];
    }

    function getCurrentParticipantDetail()
        public
        view
        isNotAdmin
        returns (Participant memory)
    {
        return getParticipantDetail(msg.sender);
    }

    function updateParticipantInfo(address _participantAddr,string memory _email, string memory _name)
        public
        isAdmin
    {
        participantMap[_participantAddr].email = _email;
        participantMap[_participantAddr].name = _name;
        participantList[participantMap[_participantAddr].index].email = _email;
        participantList[participantMap[_participantAddr].index].name = _name;
    }

    function updateCurrentParticipantInfo(string memory _email, string memory _name)
        public
    {
        require(
            participantMap[msg.sender].account == msg.sender,
            "You are not allowed"
        );
        participantMap[msg.sender].email = _email;
        participantMap[msg.sender].name = _name;
        participantList[participantMap[msg.sender].index].email = _email;
        participantList[participantMap[msg.sender].index].name = _name;
    }

    function isSignIn(address _account) public view returns (bool) {
        return participantMap[_account].account != address(0);
    }

    function checkRole() public view returns (uint256) {
        if (checkAdmin() == true) return 1;
        if (signIn() == true) return 2;
        return 0;
    }



    function signIn() internal view returns (bool) {
        return isSignIn(msg.sender);
    }

    function increaseParticipantSessionCount(address _participantAddr) external {
        uint256 newCount = participantMap[_participantAddr].sessionsCount + 1;
        participantMap[_participantAddr].sessionsCount = newCount;
        participantList[participantMap[_participantAddr].index]
            .sessionsCount = newCount;
    }

    function updateParticipantDeviation(address _participantAddr, uint256 _deviation)
        external
    {
        participantMap[_participantAddr].deviation = _deviation;
        participantList[participantMap[_participantAddr].index].deviation = _deviation;
    }

    receive() external payable {}
}
