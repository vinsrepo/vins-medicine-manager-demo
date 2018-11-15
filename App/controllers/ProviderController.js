const Helper = require("../helpers/Medicine");
var Web3 = require('web3');
var web3 = new Web3(Helper.host);
var Medicine = new web3.eth.Contract(Helper.medicine.abi, Helper.medicine.address); // init contract
var Digital = new web3.eth.Contract(Helper.digital.abi, Helper.digital.address); // init contract

module.exports = {
    insertProvider: (req, res) => {
        Provider.methods.updateProvider(
            req.body.providerId,
            req.body.providerName,
            req.body.providerAddress,
            req.body.providerTelephone,
            req.body.providerOwner,
        )
        .send({
            from: "",
            gasLimit: 3000000
        })
        .on("receipt", receipt => {
            if(!receipt.status) return res.json({status: 400});
            return res.json({status: 200})
        })
    },

    changeProvider: (req, res) => {
        Provider.methods.changeProvider(
            req.body.providerName,
            req.body.providerAddress,
            req.body.providerTelephone,
            req.body.providerOwner,
        )
        .send({
            from: "",
            gasLimit: 3000000
        })
        .on("receipt", receipt => {
            if(!receipt.status) return res.json({status: 400});
            return res.json({status: 200})
        })
    },

    providerById: (req, res) => {
        if(req.body.keyword != ""){
            Medicine.methods.getProvider(parseInt(req.body.keyword))
                            .call()
                            .then(provider => {
                                res.json({
                                    status: 200,
                                    provider: provider
                                })
                            })
                            .catch(err => {

                                res.json({
                                    status: 400,
                                    provider: []
                                })
                            })
        }
    },

    providerByAccount: async (req, res) => {
        var account = req.body.account;
        console.log('account: ', account);
        if(account && account != ""){
            var id = await Medicine.methods.addressToProvider(account).call().then();
            console.log('id: ', id);

            Medicine.methods.getProvider(id)
                            .call()
                            .then(provider => {
                                console.log('provider: ', provider);
                                res.json({
                                    status: 200,
                                    provider: provider
                                })
                            })
                            .catch(err => {
                                console.log('err: ', err);
                                res.json({
                                    status: 400,
                                    provider: []
                                })
                            })
        }
        
    },

    medicineById: async (req, res) => {
        if(req.body.keyword != ""){
            var medicine = await Medicine.methods.getInforMedicine(parseInt(req.body.keyword))
                            .call()
                            .then(medicine => {
                                return {
                                    status: 200,
                                    data: medicine
                                };
                            })
                            .catch(err => {
                                return {
                                    status: 400
                                }
                            })
            
            if(medicine.status == 200){
                var addressMedicine = await Medicine.methods.getmedicineAddressOf(medicine.data[1]).call().then();
                var providerId = await Medicine.methods.addressToProvider(addressMedicine).call().then();
                var provider = await Medicine.methods.getProvider(providerId).call().then();
                
                res.json({
                    status: medicine.status,
                    medicine: medicine.data,
                    provider: provider
                })
            }
            
        }
    },

    listMedicines: async (req, res) => {
        var medicineIds = await Medicine.methods.getaddressUserToMedicineIndex(req.param('address')).call().then();
        if(medicineIds && medicineIds.length > 0){
            var medicines = await Medicine.methods.getMedicines(medicineIds).call().then();

            res.json({
                status: 200,
                medicines: medicines
            })
        }else{
            res.json({
                status: 200,
                medicines: []
            })
        }
        
    },

    listLicenses: async (req, res) => {
        console.log(req.param('address'));
        var ceritifateIds = await Medicine.methods.getaddressToCeritifateIndex(req.param('address')).call().then();
        console.log('ceritifateIds: ', ceritifateIds);
        if(ceritifateIds && ceritifateIds.length > 0){
            var ids = [];
            ceritifateIds.forEach(e => ids.push(parseInt(e)));
            console.log(ids);
            var listLicenses = await Digital.methods.getmanyInforDigitalCertificate(ids)
                                                    .call({
                                                        from: req.param('address'),
                                                    }).then();

            res.json({
                status: 200,
                listLicenses: listLicenses
            })
        }else{
            res.json({
                status: 200,
                listLicenses: []
            })
        }
    },

    uploadMedicineImage: (req, res) => {
        var path = req.file.filename;
        // const ipfsAPI = require('ipfs-api');
        // const fs = require('fs');
        // // const multiHash = require('multi-hash');
        // // const ipfsDag= require('ipfs-dag');

        // //Connceting to the ipfs network via infura gateway
        // const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'});
        // const dir = '/home/hienvu/Desktop/Data-IMG';
        //     var testFile = fs.readFileSync("/home/hienvu/Desktop/Data-IMG/11.jpg");
        //     var testBuffer = new Buffer(testFile);
        // ipfs.files.add(testBuffer, function (err, file) {
        //     if(err) {
        //         console.log(err);
        //     } else {
        //         console.log(file);

        if(path){
            res.json({
                status: 200,
                path: path
            })
        }
    }
}