const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({ //Створює схуму як і по яким  правильм  дані  сохраняється
    username: {
        type: String, //Вказати  тип  дани
        unique: true, //Відповідає за  уникальність даних
        required: true, //Вдповідає шо  це  поле  повино обовязково  бути  при  сохраненій  дани
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, required: true }],
    following: [{ type: mongoose.Schema.Types.ObjectId, required: true }],
    friendRequests: [{ type: mongoose.Schema.ObjectId, required: true }],
    blocked: [{ type: mongoose.Schema.Types.ObjectId, retuired: true }],
    chat: [{ type: String, require: true }],
    createDate: {
        type: Date,
        default: Date.now,
        required: true,
    }
});

const UserModule = mongoose.model('User', UserSchema);//Цей  меток  каже  щоб  створити модель  бази надин
module.exports = UserModule;