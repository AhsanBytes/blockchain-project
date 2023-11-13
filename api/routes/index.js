const express=require('express');
const router = express.Router();
const { get_Name, get_Token, get_ID, get_Desc, get_balance,get_all, update_name, get_wallet_balance, get_PKIUnits, get_stripe, pay_stripe_and_update_pki} = require('../controller/index');

router.route('/update-name').post(update_name);
router.route('/get_Name').get(get_Name);
router.route('/get_TokenName').get(get_Token);
router.route('/get_ID').get(get_ID);
router.route('/get_Desc').get(get_Desc);
router.route('/get_balance').get(get_balance);
router.route('/get_all').get(get_all);
router.route('/get_wallet_balance').post(get_wallet_balance);
router.route('/get_PKIUnits').post(get_PKIUnits);
router.route('/stripe').get(get_stripe);
router.route('/stripe/pay').post(pay_stripe_and_update_pki);

module.exports=router;