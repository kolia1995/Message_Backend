const mongoose = require('mongoose');

const messageSchema = require('./messageModule.js');

const chatSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    admin: [{ type: mongoose.Schema.Types.ObjectId, required: true }],
    users: [{ type: mongoose.Schema.Types.ObjectId, required: true }],
    blocked: [{ type: mongoose.Schema.Types.ObjectId, required: true }],
    message: [messageSchema],
    isGroupChat: {
        type: Boolean,
        default: false,
    },
    settings: {
        write: { type: Boolean, default: true },
        media: { type: Boolean, default: true },
        links: { type: Boolean, default: true },
        invite: { type: Boolean, default: false },
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const ChatModule = mongoose.model('Chat', chatSchema);
module.exports = ChatModule;