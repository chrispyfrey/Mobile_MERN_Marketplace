var CartItem = require('../models/order.model')
var Order = require('../models/order.model')
var Charity = require('../models/charity.model')
var _ = require('lodash')
var errorHandler = require('./../helpers/dbErrorHandler')

const create = (req, res) => {
  let cartItems = [];
  let total = 0;

  for (let i = 0; i < req.body.order.products.length; ++i) {
    let ci = new CartItem.CartItem();
    ci.product = req.body.order.products[i]._id;
    ci.quantity = req.body.order.products[i].cartNum;
    ci.shop = req.body.order.products[i].shop._id;
    total += req.body.order.products[i].price * req.body.order.products[i].cartNum;
    cartItems.push(ci);
  }

  req.body.order.products = cartItems;
  req.body.order.user = req.profile;
  req.body.order.total = total;
  const order = new Order.Order(req.body.order);

  if(req.body.order.donation) {
      Charity.findOne({name: req.body.order.donation})
          .select('_id')
          .exec((err, charity) => {
              if (err) {
                  console.log(err.message);
                  console.log('defaulting to null donation');
                  order.donation = null;
              }
              if (!charity) {
                  console.log('order submitted with invalid charity, setting donation to null');
                  order.donation = null;
              } else {
                  order.donation = charity._id;
              }
              order.save((err, result) => {
                  if (err) {
                      console.log(err.message);
                      return res.status(400).json({
                          error: err.message
                      })
                  }
                  console.log("finished saving order");
                  res.status(200).json(result);
              })
          })
  }
  else {
      order.save((err, result) => {
          if(err) {
              console.log(err.message)
              return res.status(400).json({
                  error: errorHandler.getErrorMessage(err)
              })
          }
          console.log("finished saving order");
          return res.status(200).json(result);
      })
  }
}

const listByShop = (req, res) => {
  Order.Order.find({"products.shop": req.shop._id})
  .populate({path: 'products.product', select: '_id name price'})
  .sort('-created')
  .exec((err, orders) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(orders)
  })
}

const update = (req, res) => {
  Order.Order.update({'products._id':req.body.cartItemId}, {'$set': {
        'products.$.status': req.body.status
    }}, (err, order) => {
      if (err) {
        return res.status(400).send({
          error: errorHandler.getErrorMessage(err)
        })
      }
      return res.json(order)
    })
}

const getStatusValues = (req, res) => {
  res.json(CartItem.schema.path('status').enumValues)
}

const orderByID = (req, res, next, id) => {
  Order.Order.findById(id).populate('products.product', 'name price').populate('products.shop', 'name').exec((err, order) => {
    if (err || !order)
      return res.status('400').json({
        error: "Order not found"
      })
    req.order = order
    next()
  })
}

const listByUser = (req, res) => {
  Order.Order.find({ "user": req.profile._id })
        .sort('-created')
        .exec((err, orders) => {
            if (err) {
              return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
              })
            }
            res.json(orders)
        })
}

const read = (req, res) => {
  return res.json(req.order)
}

module.exports = {
  create,
  listByShop,
  update,
  getStatusValues,
  orderByID,
  listByUser,
  read
}
