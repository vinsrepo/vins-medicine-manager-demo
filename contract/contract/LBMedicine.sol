pragma solidity ^0.4.25;
pragma  experimental ABIEncoderV2;

import "./LBProvider.sol";
import "./LBDigitalCertificate.sol";


contract LBMedicine is LBProvider{
    struct Medicine {
        string imgHash; // change in here dsdsd
        uint medicineId;
        string medicineName; // 
        string ingredient; // include ... 
        string benefit; // uses for, function for 
        string productsBy;
        uint medicinePrices; // id of digitalCertificateId default = 0;
        bool isValidMedicine; 
    }
    
    address public owner;
    Medicine[] public medicines;
    

    mapping(address => uint[])  addressUserToMedicineIndex;  // get ra index cua list medicine tu address
    mapping(uint => address)  medicineAddressOf; // medicine nay cua address nao //tu thang index get ra address cua thang white list 
    mapping(address => uint[])  addressToCeritifateIndex;
    mapping(address => uint) public addressToProvider; //  address nay c
    mapping(address => bool) isRegister;  // da 
    mapping(uint => uint) public certificateToMedicine;
    mapping(uint => uint) public meddicineToCertificate;
    // mapping(address => mapping(uint => bool)) public isMedicineOf;
    
    modifier isNotRegisterUser(address _addr) {
        require(!isRegister[_addr]);
        _;
    }
    
    modifier isRegisterUser(address _addr) {
        require(isRegister[_addr]);
        _;
    }
    
    
    modifier isOwnerMedicine(uint _id) {
        require(medicineAddressOf[_id] == msg.sender);
        _;
    }
    // change 
    function accountIsRegister() public view returns(bool) {
        return isRegister[msg.sender];
    }

    function getaddressUserToMedicineIndex(address _addr) public view returns(uint[]) {
        return addressUserToMedicineIndex[_addr];
    }

    function getaddressToCeritifateIndex(address _addr) public view returns(uint[]) {
        return addressToCeritifateIndex[_addr];
    }
     // end change
    function getmedicineAddressOf(uint _index) public view returns(address) {
        return medicineAddressOf[_index];
    }
    
    function setaddressToCeritifateIndex(uint _index, address _addr) public {
        addressToCeritifateIndex[_addr].push(_index);
    }
    
    function setcertificateToMedicine(uint _index1, uint _index2) public {
        certificateToMedicine[_index1] = _index2;
        meddicineToCertificate[_index2] = _index1;
    }
    

    
    function updateMedicine(string _imgHash,
                            string _medicineName,
                            string _ingredient,
                            string _benefit,
                            string _productBy,
                            uint _prices,
                            uint _index) 
                            isOwnerMedicine(_index) public returns(bool _suc) {
        medicines[_index].imgHash  = _imgHash;        
        medicines[_index].medicineName  = _medicineName;
        medicines[_index].ingredient = _ingredient;
        medicines[_index].benefit = _benefit;
        medicines[_index].productsBy = _productBy;
        medicines[_index].medicinePrices = _prices;
        _suc = true;
        return;
    }
    
    function registerUser(string _hashImg,string _providerName, string _addr, string _phone) isNotRegisterUser(msg.sender)  public returns(bool _suc) {
        uint myindex = insertProvider(_hashImg,_providerName, _addr, _phone);
        addressToProvider[msg.sender] =  myindex;
        isRegister[msg.sender] = true;
        _suc = true;
        return;
    }
    
    function getInforMedicine(uint _index) public view returns(Medicine) {
       return medicines[_index];
    }
    
    function setMedicine(bool _value, uint _index) external returns(bool _suc) {
        medicines[_index].isValidMedicine = _value;
        _suc = true;
        return;
    }
    
    function insertMedecine(string _imgHash,
                            string _name,
                            string _ingredient,
                            string _benefit,
                            string _productBy,
                            uint _prices
                            )
                            public returns(uint) {
        uint myindex = medicines.push(Medicine(_imgHash,medicines.length, _name, _ingredient, _benefit, _productBy, _prices, false)) - 1;
        return myindex;
    }
    
    function registerMedecine(string _imgHash,  // change in herree
                              string _medicineName,
                              string _structure,
                              string _uses,
                              string _productsBy,
                              uint _prices,
                              address _digitalcontractAddress
                             ) 
                             isRegisterUser(msg.sender)  // check is register
                             public {
        uint myindex = insertMedecine(_imgHash,_medicineName, _structure, _uses, _productsBy, _prices);
        addressUserToMedicineIndex[msg.sender].push(myindex);
        medicineAddressOf[myindex] = msg.sender;
        for(uint256 i = 0; i < LBDigitalCertificate(_digitalcontractAddress).getAddresslength(); i++) {
            address _myaddr = LBDigitalCertificate(_digitalcontractAddress).getAddress(i);
            LBDigitalCertificate(_digitalcontractAddress).setWaittingForApprove(_myaddr, myindex);
        }
           // add wattingForApprove whitelists
    }
    
    function getMedicines(uint[] _index) public view returns(Medicine[]) {
        require(_index.length > 0);
        Medicine[] memory _medicine = new Medicine[](_index.length);
        for(uint8 i = 0; i < _index.length; i++) {
            _medicine[i] = medicines[_index[i]];
        }
        
        return _medicine;
    }
    
}