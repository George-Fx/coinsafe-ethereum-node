import express from 'express';

import {sendToken} from '../controllers/sendToken.js';
import {getBalance} from '../controllers/getBalance.js';
import {estimateFee} from '../controllers/estimateFee.js';
import {sendEthereum} from '../controllers/sendEthereum.js';
import {createWallet} from '../controllers/createWallet.js';
import {restoreWallet} from '../controllers/restoreWallet.js';
import {estimateFeeEth} from '../controllers/estimateFeeEth.js';
import {getTransactions} from '../controllers/getTransactions.js';

export const router = express.Router();

router.post('/sendToken', sendToken);
router.post('/getBalance', getBalance);
router.post('/estimateFee', estimateFee);
router.get('/createWallet', createWallet);
router.post('/sendEthereum', sendEthereum);
router.post('/restoreWallet', restoreWallet);
router.post('/estimateFeeEth', estimateFeeEth);
router.post('/getTransactions', getTransactions);
