// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0;

contract Admin {
    address private admin;

    event AdminSet(address indexed oldAdmin, address indexed newAdmin);

    modifier isAdmin() {
        require(checkAdmin() == true, "Caller is not Admin");
        _;
    }

    constructor() {
        admin = msg.sender;
        emit AdminSet(address(0), admin);
    }

    function changeAdmin(address newAdmin) public isAdmin {
        emit AdminSet(admin, newAdmin);
        admin = newAdmin;
    }

    function getAdmin() external view returns (address) {
        return admin;
    }

    function checkAdmin() public view returns (bool) {
        return msg.sender == admin;
    }
}
