let mongoose = require('mongoose')

const CharitySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String,
    },
    zip: {
        type: Number
    },
    EIN: {
        type: Number,
        required: 'EIN is required'
    },
    image: {
        data: Buffer,
        contentType: String
    },
    cause: {
        type: String,
    },
    url:{
        type: String,
        required: 'URL is required'
    }
})

CharitySchema.pre('save', function(next) {
    let charity = this;
    const causes = ['Arts and Culture', 'Children and Family', 'Environment and Sustainability', 'Hunger and Poverty', 'Animals', 'Health', 'Elderly']
    let date = new Date();

    if (this.name === '') {
        return next({code: 400, message: "Name cannot be null."})
    }
    if (this.EIN === null || this.EIN.length() !== 10) {
        return next({code: 400, message: "Invalid EIN."})
    }
    if (!causes.includes(this.cause) || this.cause === '') {
        return next({code: 400, message: "Invalid genre."})
    }
    if (this.url === null){
        return next({code: 400, message: "Charity url cannot be blank."})
    }
    //valid movie info
    next();
});

module.exports = mongoose.model('Charity', CharitySchema)
