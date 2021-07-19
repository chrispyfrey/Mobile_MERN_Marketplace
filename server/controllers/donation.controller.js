var Donation = require('../models/donation.model')
var config = require('../config/config')
var errorHandler = require('./../helpers/dbErrorHandler')

const create = (req, res) => {
    if(req.body.d)
    console.log(req.body.donation)
    const donation = new Donation(req.body.donation);
    console.log("created donation")
    donation.save((err, result) => {
        if(err){
            console.log(err)
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)})
        }
        console.log("saved")
        return res.status(200).json(result);
    })
}

const getTotalDonationsForUser = (req, res, next) => {
    Donation.aggregate([
        {$match: {user: req.profile._id}},
        {$lookup: {
                from: "charities",
                localField: "charity",
                foreignField: "_id",
                as: "charity_object"
            }},
        {$group: {
            _id: "$charity",
            total_to_date_cents: {$sum: "$amount"},
            charity: {$first: {$first: "$charity_object.name"}} //little weird but mongo returns this as an array otherwise
            }},
        {$sort: {
            charity: 1
            }}
    ]).exec((err, donations) => {
        if(err)
            return res.json(err)
        return res.status(200).json({donations: donations})
    })
}

//dateString is expected to be YYYY-MM
const getTotalDonationsForMonth = (req, res, next, dateString) => {
    //return sorted by month desc (newest -> oldest)
    let dateParts = dateString.split('-');
    //verify passed date is valid
    if(dateParts.length === 2) {
        let date = new Date(dateParts[0], dateParts[1]-1); //js Date month is 0-indexed
        Donation.aggregate([
            {$match: {month: date.getMonth()+1, year: date.getFullYear()}}, //mongoose Date not 0-indexed
            {$group: {
                    "_id": {year: { $year: "$date"}, month: { $month: "$date" }, charity: "$charity"},
                    "donation_total": {$sum: "$amount"}
                }},
        ])
            .exec((err, donations) => {
                if(err)
                    return res.json(err)
                return next(donations);
            })
    }
    else{
        return next({error: "date format should be YYYY-MM"})
    }
}

const getTotalDonationsByMonth = (req, res, next) => {
    Donation.aggregate([
        {$group: {
                "_id": {year: { $year: "$date"}, month: { $month: "$date" }, charity: "$charity"},
                "donation_total": {$sum: "$amount"}
            }},
        {$sort: {"_id.year": -1, "_id.month": 1}}
    ])
    .exec((err, donations) => {
        if(err){
            console.log(err.message)
            return res.json(err)
        }
        res.json(donations);
        return next(donations);
    })
}

const listByCharity = (req, res) => { //return array of donations by charities from mongodb displays to user
    Donation.find({"//charities": req.charity._id})
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

const listByUser = (req, res) => {
    Donation.find({ "user": req.profile._id })
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

module.exports = {
    create,
    getTotalDonationsForUser,
    getTotalDonationsForMonth,
    getTotalDonationsByMonth,
    listByCharity,
    listByUser
}