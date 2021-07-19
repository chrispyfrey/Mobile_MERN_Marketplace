var express = require('express')
var userCtrl = require('../controllers/user.controller')
var authCtrl = require('../controllers/auth.controller')
var donationCtrl = require('../controllers/donation.controller')

const router = express.Router()

router.route('/api/users')
  .get(userCtrl.list)
  .post(userCtrl.create)

router.route('/api/users/:userId')
  .get(authCtrl.requireSignin, userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove)

router.route('/api/users/:userId/donations')
    .get(authCtrl.requireSignin, donationCtrl.getTotalDonationsForUser)

router.route('/api/stripe_auth/:userId')
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.stripe_auth, userCtrl.update)


router.param('userId', userCtrl.userByID)

module.exports = router;
