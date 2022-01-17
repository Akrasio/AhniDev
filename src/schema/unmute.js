const {
    Schema,
    model
} = require("mongoose");

module.exports = model('timedUnmute', new Schema({
    memberID: {
        type: String,
        required: true
    },
    guildID: {
        type: String,
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    reason: {
        type: String,
        required: false
    },
    roles: {
        type: Array,
        default: []
    },
    lastUpdated: {
        type: String,
        default: new Date().toLocaleString()
    },
    timeMS: {
        type: Number,
        required: true
    }
}));
