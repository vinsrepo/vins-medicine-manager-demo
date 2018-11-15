pragma solidity ^0.4.25;
pragma  experimental ABIEncoderV2;

import "./LBDigitalCertificate.sol";
import "./Owner.sol";


contract LBWhiteList is Owner  {  // NHA quan ly
    struct WhiteList{
        string hashImg;
        uint whiteListId; 
        string whiteListName;
        string whiteListAddress;
    }

    struct Approve {
        uint id;
        bool valid;
    }
    
    
    address[] public whitelistAddress;
    WhiteList[] internal  whitelists;
    mapping(address => mapping(uint => bool))  wattingForApprove;
    mapping(address => mapping(uint => bool))  _isValidApprove;
    mapping(address => Approve[])  idForWattingByOneWhiteList;  // list ids for watting
    mapping(uint => bool) public  isWaitting;
    mapping(address => bool)  isWhiteList;
    mapping(address => uint) waittingIndex;
    mapping(address => uint) approvedIndex;

    
    
    modifier _isWhiteList(address _addr) {
        require(isWhiteList[_addr]);
        _;
    }
    
    modifier _isWaitting(uint _id) {
        require(isWaitting[_id]);
        _;
    }
    
    modifier _whiteListIsExists(address _addr) {
        for(uint i = 0; i < whitelistAddress.length; i++) {
            require(_addr != whitelistAddress[i]);
        }
        _;
    }
    function addressIsWhiteList(address _addr) public view returns(bool) {
        return isWhiteList[_addr];
    }
    function getAddresslength() public view returns(uint) {
        return whitelistAddress.length;
    }
    
    function getAddress(uint _id) public view returns(address) {
        return whitelistAddress[_id];
    }
    
    // function setAddressWhiteList(address[] _add) onlyOwner public returns(bool _suc) { // onlyowner
    //     require(_add.length > 0 && _add.length <= 10); 
    //     for(uint8 i = 0; i < _add.length; i++) {
    //         whitelistAddress.push(_add[i]);
    //         isWhiteList[_add[i]] = true;
    //     }
    //     _suc = true;
    //     return;
    // }
    
    function getWaittingForApprove(uint _id) _isWhiteList(msg.sender)  public view returns(bool) {
        return wattingForApprove[msg.sender][_id];
    }
    
    function setWaittingForApprove(address _add, uint _id) public returns(bool){
        require(_add != 0x0);
        isWaitting[_id] = true;
        wattingForApprove[_add][_id] = true;
        idForWattingByOneWhiteList[_add].push(Approve(_id, true));
        waittingIndex[msg.sender]++;
        return true;
    }
    
    // function getWhiteListAddress(uint _index) public view returns(address) {
    //     return whitelistAddress[_index];
    // }
    function updateWhiteList(string _whiteListName,
                            string _whiteListAddress,
                            uint _index)
                            onlyOwner    
                            public returns(bool _suc) {
        whitelists[_index].whiteListName = _whiteListName;
        whitelists[_index].whiteListAddress = _whiteListAddress;
        _suc = true;
        return;
    }
    
    function getWhiteListByIndex(uint _index) public view returns(WhiteList) {
       return whitelists[_index];
    }
    
    function insertWhitelist(string _hashIMG,
                             string _name, 
                             string _addr, 
                             address _address)
                             isNotOwner(_address)
                             onlyOwner  
                             public returns(uint) {
        uint myindex = whitelists.push(WhiteList(_hashIMG, whitelists.length, _name, _addr)) - 1;
        whitelistAddress.push(_address);
        isWhiteList[_address] = true;
        return myindex;
    }
    
    function getWhiteLists(uint[] _index) public view returns(WhiteList[]) {
        WhiteList[] memory _whitelist = new WhiteList[](_index.length);
        for(uint8 i = 0; i < _index.length; i++) {
            _whitelist[i] = whitelists[_index[i]];
        }
        return _whitelist;
    }
    
    function getTotalWhitelist() public view returns(WhiteList[]) {
        return whitelists;
    }
    
    function approve(uint _medicineId) _isWhiteList(msg.sender) _isWaitting(_medicineId) internal {
        _isValidApprove[msg.sender][_medicineId] = true;
        wattingForApprove[msg.sender][_medicineId] = false;
        uint _length = idForWattingByOneWhiteList[msg.sender].length;
        waittingIndex[msg.sender]--;
        approvedIndex[msg.sender]++;
        for(uint i = 0; i < _length; i++) {
            if(idForWattingByOneWhiteList[msg.sender][i].id == _medicineId) {
                idForWattingByOneWhiteList[msg.sender][i].valid = false;
            }
        }

    }
    
    function countWhiteListApprove(uint _medicineId) _isWhiteList(msg.sender) internal view returns(uint) {
        uint _count = 0;
        for(uint8 i = 0; i < whitelistAddress.length; i++) {
            if(_isValidApprove[whitelistAddress[i]][_medicineId]) {
                _count++;
            } 
        }
        return _count;
    }
    
    function getlistIdsApproved() _isWhiteList(msg.sender) public view returns(uint[]) {
        uint _length  = approvedIndex[ms.sender];
        uint[] memory _approveList = new uint[](_length);
        for(uint i = 0; i < _length; i++) {
            if(idForWattingByOneWhiteList[msg.sender][i].valid == false) {
                _approveList[i] = idForWattingByOneWhiteList[msg.sender][i].id;
            }
        }
        return _approveList;
    }
    
    function getlistIdsWaittingForApprove() _isWhiteList(msg.sender) public view returns(uint[]) {
        uint _length  = waittingIndex[msg.sender];
        uint[] memory _wattinglist = new uint[](_length);
        for(uint i = 0; i < _length; i++) {
            if(idForWattingByOneWhiteList[msg.sender][i].valid == true) {
                _wattinglist[i] = idForWattingByOneWhiteList[msg.sender][i].id;
            }
        }
        return _wattinglist;
    }
}