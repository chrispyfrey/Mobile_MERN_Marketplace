var mongoose = require('mongoose');
var Order = require('./order.model')

const DonationSchema = new mongoose.Schema({
    date: {type: Date, default: Date.now},
    amount: {type: Number},
    customer_name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    customer_email: {
        type: String,
        trim: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: 'Email is required'
    },
    user: {type: mongoose.Schema.ObjectId, ref: 'User'},
    charity: {type: mongoose.Schema.ObjectId, ref: 'Charity'}
})
/*
DonationSchema.pre('save', function(next) {

    let prototype = this;
    Order.find({payment_id: prototype.payment_id})
        .exec((err, res) => {
            if(err || !res){
                res.statusCode = 500;
                return next(err);
            }
            return next();
        })
})
*/
const Donation = mongoose.model('Donation', DonationSchema);

module.exports = Donation