var User = require('../models/user.model')
var Donation = require('../models/donation.model')
var donationCtrl = require('./donation.controller')
var _ = require('lodash')
var errorHandler = require('../helpers/dbErrorHandler')
var request = require('request')
var config = require('../config/config')
var stripe = require('stripe')

const myStripe = stripe(config.stripeSecretKey)

const create = (req, res, next) => {
  const user = new User(req.body)
  user.save((err, result) => {
    if (err) {
      return res.status(400).json({
        error: err.message
      })
    }
    res.status(200).json({
      message: "Successfully signed up!"
    })
  })
}

/**
 * Load user and append to req.
 */
const userByID = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user)
      return res.status('400').json({
        error: "User not found"
      })
    req.profile = user
    next()
  })
}

const read = (req, res) => {
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  return res.json(req.profile)
}

const list = (req, res) => {
  User.find((err, users) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(users)
  }).select('name email updated created')
}

const update = (req, res, next) => {
  let user = req.profile
  user = _.extend(user, req.body)
  user.updated = Date.now()
  user.save((err) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    user.hashed_password = undefined
    user.salt = undefined
    res.json(user)
  })
}

const remove = (req, res, next) => {
  let user = req.profile
  user.remove((err, deletedUser) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    deletedUser.hashed_password = undefined
    deletedUser.salt = undefined
    res.json(deletedUser)
  })
}

const isSeller = (req, res, next) => {
  const isSeller = req.profile && req.profile.seller
  if (!isSeller) {
    return res.status('403').json({
      error: "User is not a seller"
    })
  }
  next()
}

const stripe_auth = (req, res, next) => {
  request({
    url: "https://connect.stripe.com/oauth/token",
    method: "POST",
    json: true,
    headers: {"Stripe-Account": config.stripeSellerAccount},
    body: {client_secret:config.stripeSecretKey, code:req.body.stripe, grant_type:'authorization_code'}
  }, (error, response, body) => {
    //update user
    if(body.error){
      return res.status('400').json({
        error: body.error_description
      })
    }
    req.body.stripe_seller = body
    next()
  })
}

const stripeCustomer = (req, res, next) => {
  if(req.profile.stripe_customer){
      //update stripe customer
      myStripe.customers.update(req.profile.stripe_customer, {
          source: req.body.token
      }).then((customer, err) => {
        if(err){
          return res.status(400).send({
            message: err.message
          })
        }
        req.body.order.payment_id = customer.id
        console.log("finished updating stripeCustomer")
        next()
      }).catch((err) => console.log(err))
  }else{
      myStripe.customers.create({
            email: req.profile.email,
            source: req.body.token
      }).then((customer) => {
          User.update({'_id':req.profile._id},
            {'$set': { 'stripe_customer': customer.id }},
            (err, order) => {
              if (err) {
                console.log(err.message)
                return res.status(400).send({
                  error: errorHandler.getErrorMessage(err)
                })
              }
              req.body.order.payment_id = customer.id
              console.log("finished creating stripeCustomer")
              next()
            })
      })
  }
}

const createCharge = (req, res, next) => {
  let chargeAmount;
  let order = JSON.parse(JSON.stringify(req.order)) //weird hack workaround, req.order.total returns undefined w/o this
  
  //roundup functionality
  if (req.order.donation) {
    let baseCharge = order.total * 100;
    let chargeCents = baseCharge % 100;

    chargeAmount = baseCharge + (100 - chargeCents);

    let donation = new Donation({
      date: Date.now(),
      amount: (100 - chargeCents),
      customer_name: req.order.customer_name,
      customer_email: req.order.customer_email,
      user: req.profile._id,
      charity: req.order.donation,
    })
    donation.save((err, res) => {
      if (err) {
        console.log(err.message);
      }
    })

  }
  //no donation
  else {
    chargeAmount = order.total * 100;
  }
  myStripe.tokens.create({
    customer: req.profile.stripe_customer,
  }, {
    stripeAccount: config.stripeSellerAccount,
  }).then((token) => {
    myStripe.charges.create({
      amount: chargeAmount, //amount in cents
      currency: "usd",
      source: token.id,
    }, {
      stripeAccount: config.stripeSellerAccount,
    }).then((charge) => {
      console.log(charge.outcome)
      next()
    }).catch((err) => {
      console.log(err)
      next(err)
    })
  })
}

module.exports = {
  create,
  userByID,
  read,
  list,
  remove,
  update,
  isSeller,
  stripe_auth,
  stripeCustomer,
  createCharge
}
