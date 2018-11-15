var express = require('express');
var router = express.Router();
var Provider = require("../App/controllers/ProviderController");
var WhileList = require("../App/controllers/WhileListController");
var Manager = require("../App/controllers/ManagerController");
var multer = require('multer');
const multerConf = {
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './public/images/medicines')
        },
        filename: (req, file, cb) => {
            const ext = file.mimetype.split('/')[1];
            cb(null, file.fieldname + '-' + Date.now() + '.' + ext);
        }
    }),
    // fileFilter: function (req, file, next) {
    //     if(!file ) {
    //             next();
    //     }

    //     const image = file.mimetype.startWidth('image/');
    //     console.log('image: ', image);
    //     if(image){
    //         next(null, true);
    //     }else{
    //         next({message: "File type not supported"}, false);
    //     }
        
    // }
}


router.post('/insert-provider', Provider.insertProvider) // add provider
      .post('/change-provider', Provider.changeProvider) // change provider
      .post('/get-provider', Provider.providerById) // get provider
      .post('/providerByAccount', Provider.providerByAccount) // get provider
      .post('/get-medicine', Provider.medicineById) // get medicine
      .get('/list-medicines', Provider.listMedicines) // get list medicines
      .get('/list-licenses', Provider.listLicenses) // get list licenses
      .post('/insert-whileList', WhileList.insertWhileList) // insert WhileList
      .post('/change-whileList', WhileList.changeWhileList) // change WhileList
      .get('/list-waitting-approve', Manager.listWaitingApprove) // change WhileList
      .get('/list-approved', Manager.listApproved) // change WhileList
      .post('/upload-medicine-image', multer(multerConf).single('image'), Provider.uploadMedicineImage)
module.exports = router;