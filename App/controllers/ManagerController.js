const Helper = require("../helpers/Medicine");
var Web3 = require('web3');
var web3 = new Web3(Helper.host);
var Medicine = new web3.eth.Contract(Helper.medicine.abi, Helper.medicine.address); // init contract
var Digital = new web3.eth.Contract(Helper.digital.abi, Helper.digital.address); // init contract

module.exports = {
    listWaitingApprove: async (req, res) => {
        var account = req.param('account');
        if (account && account != ""){
            var medicineIds = await Digital.methods.getlistIdsWaittingForApprove()
                       .call({
                           from: account
                       }).then();

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

        }
        
    },

    listApproved: async (req, res) => {
        var account = req.param('account');
        if (account && account != ""){
            var medicineIds = await Digital.methods.getlistIdsApproved().call({
                from: account
            }).then();
            
            
            if(medicineIds && medicineIds.length > 0){
                var medicines = await Medicine.methods.getMedicines(medicineIds).call().then();

                res.json({
                    status: 200,
                    medicines: medicines
                })
                
            }else{
                res.json({
                    status: 400,
                    approved: []
                })
            }
        }
        
        
    },


   
}