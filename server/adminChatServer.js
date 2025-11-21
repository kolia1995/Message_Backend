const UserModule = require('../modules/userModule.js');
const ChatModule = require('../modules/chatModule.js');
const Tokens = require('../config/tokens.js');

class AdminChatServer {
    async adminChatAddServer(idChat, idUser, tokenA, tokenR) {
        try {
            const validToken = await Tokens.validTokens(tokenA, tokenR);
            if (!validToken) return { index: 'token', error: 'false token' };

            const chat = await ChatModule.findById(idChat);
            if (!chat) return { index: 'chat', error: 'chat not found' };

            const isAdmin = chat.admin.some(a => a.toString() === validToken._id.toString());
            const isUser = chat.users.some(u => u.toString() === idUser.toString());

            if (!chat.settings.invite && !isAdmin && !isUser) {
                return { index: 'chat', error: 'false chat' };
            }

            await ChatModule.updateOne({ _id: idChat }, { $push: { users: idUser } });
            await UserModule.updateOne({ _id: idUser }, { $push: { chat: idChat } });

            return true;
        } catch (err) {
            console.error(err);
        }
    }

    async adminChatGiveAdminServer(idChat, idUser, tokenA, tokenR) {
        try {
            const validToken = await Tokens.validTokens(tokenA, tokenR);
            if (!validToken) return { index: 'token', error: 'false token' };

            const chat = await ChatModule.findById(idChat);
            if (!chat) return { index: 'chat', error: 'chat not found' };

            const isAdmin = chat.admin.some(a => a.toString() === validToken._id.toString());
            const isUserAdmin = chat.admin.some(a => a.toString() === idUser.toString());

            if (!isAdmin) return { index: 'admin', error: 'false admin' };

            if (isUserAdmin) {
                await ChatModule.updateOne({ _id: idChat }, { $pull: { admin: idUser } });
            } else {
                await ChatModule.updateOne({ _id: idChat }, { $push: { admin: idUser } });
            }

            return true;
        } catch (err) {
            console.error(err);
        }
    }

    async adminChatBlockesServer(idChat, idUser, tokenA, tokenR) {
        try {
            const validToken = await Tokens.validTokens(tokenA, tokenR);
            if (!validToken) return { index: 'token', error: 'false token' };

            const chat = await ChatModule.findById(idChat);
            if (!chat) return { index: 'chat', error: 'chat not found' };

            const isAdmin = chat.admin.some(a => a.toString() === validToken._id.toString());
            const isFriend = chat.users.some(u => u.toString() === idUser.toString());
            const isBlocked = chat.blocked.some(b => b.toString() === idUser.toString());

            if (!isAdmin) return { index: 'admin', error: 'false admin' };
            if (!isFriend) return { index: 'friend', error: 'false friend' };

            if (isBlocked) {
                await ChatModule.updateOne({ _id: idChat }, { $pull: { blocked: idUser } });
            } else {
                await ChatModule.updateOne({ _id: idChat }, { $push: { blocked: idUser } });
            }

            return true;
        } catch (err) {
            console.error(err);
        }
    }

    async adminChatDeleteServer(idChat, idUser, tokenA, tokenR) {
        try {
            const validToken = await Tokens.validTokens(tokenA, tokenR);
            if (!validToken) return { index: 'token', error: 'false token' };

            const chat = await ChatModule.findById(idChat);
            if (!chat) return { index: 'chat', error: 'chat not found' };

            const isAdmin = chat.admin.some(a => a.toString() === validToken._id.toString());
            if (!isAdmin) return { index: 'admin', error: 'false admin' };

            await ChatModule.updateOne({ _id: idChat }, { $pull: { users: idUser, admin: idUser } });

            return true;
        } catch (err) {
            console.error(err);
        }
    }

    async adminChatSettingServer(idChat, canW, canM, canL, canI, tokenA, tokenR) {
        try {
            const validToken = await Tokens.validTokens(tokenA, tokenR);
            if (!validToken) return { index: 'token', error: 'false token' };

            const chat = await ChatModule.findById(idChat);
            if (!chat) return { index: 'chat', error: 'chat not found' };

            const isAdmin = chat.admin.some(a => a.toString() === validToken._id.toString());
            if (!isAdmin) return { index: 'admin', error: 'false admin' };

            await ChatModule.updateOne(
                { _id: idChat },
                {
                    $set: {
                        'settings.write': canW,
                        'settings.media': canM,
                        'settings.links': canL,
                        'settings.invite': canI
                    }
                }
            );

            return true;
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = new AdminChatServer();
