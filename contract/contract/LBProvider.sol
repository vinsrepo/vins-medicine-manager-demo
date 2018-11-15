pragma solidity ^0.4.25;
pragma  experimental ABIEncoderV2;

import "./Owner.sol";

contract LBProvider is Owner{  // NHA CUNG CAP
    struct Provider{
        string imgHash;
        uint providerId;
        string providerName;
        string providerAddress;
        string providerTelephone;
    }
    Provider[] internal providers;
    
    function updateProvider(string _imgHash,
                            string _providerName,
                            string _providerAddress,
                            string _providerTelephone,
                            uint _index)
                            onlyOwner 
                            public returns(bool _suc) {
        providers[_index].imgHash = _imgHash;
        providers[_index].providerName = _providerName;
        providers[_index].providerAddress = _providerAddress;
        providers[_index].providerTelephone = _providerTelephone;
        _suc = true;
        return;
    }

    function getAllProviders() onlyOwner public view returns(Provider[]) {
        return providers;
    }
    
    function getProvider(uint _index)  public view returns(Provider) {
       return providers[_index];
    }
    
    function insertProvider(string _imgHash,
                            string _providerName,
                            string _providerAddress,
                            string _providerTelephone
                            )
                            isNotOwner(msg.sender)
                            public returns(uint) {
        uint myindex = providers.push(Provider( _imgHash,providers.length, _providerName, _providerAddress,_providerTelephone)) - 1;
        return myindex;
    }
    
    function listProviders(uint[] _index) public view returns(Provider[]) {
        require(_index.length > 0);
        Provider[] memory _provider = new Provider[](_index.length);
        for(uint8 i = 0; i < _index.length; i++) {
            _provider[i] =  providers[_index[i]];
        }
        //
        return _provider;
    }
}