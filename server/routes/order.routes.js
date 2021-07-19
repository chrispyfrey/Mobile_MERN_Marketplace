var express = require('express')
var orderCtrl = require('../controllers/order.controller')
var productCtrl = require('../controllers/product.controller')
var authCtrl = require('../controllers/auth.controller')
var shopCtrl = require('../controllers/shop.controller')
var userCtrl = require('../controllers/user.controller')

const router = express.Router()

router.route('/api/orders/:userId')
  .post(authCtrl.requireSignin, userCtrl.stripeCustomer, productCtrl.decreaseQuantity, orderCtrl.create)

router.route('/api/orders/shop/:shopId')
  .get(authCtrl.requireSignin, shopCtrl.isOwner, orderCtrl.listByShop)

router.route('/api/orders/user/:userId')
  .get(authCtrl.requireSignin, orderCtrl.listByUser)

router.route('/api/order/status_values')
  .get(orderCtrl.getStatusValues)

router.route('/api/order/:shopId/cancel/:productId')
  .put(authCtrl.requireSignin, productCtrl.increaseQuantity, orderCtrl.update)

router.route('/api/order/:orderId/charge/:userId/:shopId')
  .put(authCtrl.requireSignin, userCtrl.createCharge, orderCtrl.update)

router.route('/api/order/status/:shopId')
  .put(authCtrl.requireSignin, shopCtrl.isOwner, orderCtrl.update)

router.route('/api/order/:orderId')
  .get(orderCtrl.read)

router.param('userId', userCtrl.userByID)
router.param('shopId', shopCtrl.shopByID)
router.param('productId', productCtrl.productByID)
router.param('orderId', orderCtrl.orderByID)

module.exports = router;
