export {}

const mongoose = require('mongoose')

const DummySchema = mongoose.Schema({
    company: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    unit_price: {
        type: Number,
        required: true
    },
    unit_weight: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    imgs: [{
        type: String
    }],
    tags: [{
        type: String
    }]
})

module.exports = mongoose.model('Dummy',DummySchema)
