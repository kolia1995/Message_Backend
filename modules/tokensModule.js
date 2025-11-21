const mongoose = require('mongoose');

const tokensSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    refreshToken: {
        type: String,
        required: true,
    },
    createAt: {
        type: Date,
        default: Date.now,
    }
});

const tokensModuel = mongoose.model('Token', tokensSchema);
module.exports = tokensModuel;