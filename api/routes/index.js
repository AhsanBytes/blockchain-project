const express=require('express');
const router = express.Router();
const { get_Name, get_Token, get_ID, get_Desc, get_balance,get_all, update_name, get_wallet_balance} = require('../controller/index');

router.route('/update-name').post(update_name);
router.route('/get_Name').get(get_Name);
router.route('/get_TokenName').get(get_Token);
router.route('/get_ID').get(get_ID);
router.route('/get_Desc').get(get_Desc);
router.route('/get_balance').get(get_balance);
router.route('/get_all').get(get_all);
router.route('/get_wallet_balance').post(get_wallet_balance);

module.exports=router;