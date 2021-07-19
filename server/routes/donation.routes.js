var express = require('express')
var orderCtrl = require('../controllers/order.controller')
var productCtrl = require('../controllers/product.controller')
var authCtrl = require('../controllers/auth.controller')
var shopCtrl = require('../controllers/shop.controller')
var userCtrl = require('../controllers/user.controller')
var donationCtrl = require('../controllers/donation.controller')

const router = express.Router();

router.route('/api/donations/')
    .post(authCtrl.requireSignin, donationCtrl.create)
    .get(authCtrl.requireSignin, donationCtrl.getTotalDonationsByMonth)

//later should support getTotalDonationsForMonth

module.exports = router