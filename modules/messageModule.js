const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ['text', 'image', 'file', 'system'],
        default: 'text',
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = messageSchema;