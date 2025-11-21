const ChatModule = require('../modules/chatModule.js');
const UserModule = require('../modules/userModule.js');

const Tokens = require('../config/tokens.js');

class MessageServer {
    async chatSaveServer(name, admin, users, isGroup, message, tokenA, tokenR) {
        try {
            const validToken = await Tokens.validTokens(tokenA, tokenR);

            if (!validToken) {
                return { index: 'token', error: 'token false' };
            }

            if (!Array.isArray(users) || users.length === 0) {
                return { index: 'user', error: 'false user' };
            }

            let chatData;

            if (isGroup) {
                chatData = {
                    name: name,
                    admin: admin,
                    users: users,
                    isGroupChat: isGroup,
                };
            } else {
                const messageObj = {
                    sender: validToken._id,
                    content: message,
                };

                chatData = {
                    name: false,
                    admin: [admin],
                    users: users,
                    message: [messageObj],
                    isGroupChat: isGroup,
                };
            }

            const chat = await ChatModule.create(chatData);
            return { idChat: chat._id };
        } catch (err) {
            console.error(err);
        }
    }

    async chatExitServer(idChat, adminChat, tokenA, tokenR) {
        try {
            const validToken = await Tokens.validTokens(tokenA, tokenR);

            if (!validToken) {
                return { index: 'token', error: 'token false' };
            }

            const chat = await ChatModule.findById(idChat);
            const user = await UserModule.findById(validToken._id);

            if (!chat) {
                return { index: 'chat', error: 'false chat' };
            }

            if (chat.isGroupChat) {
                if (adminChat) {
                    chat.admin = chat.admin.filter(
                        id => id.toString() !== validToken._id.toString()
                    );
                    chat.users = chat.users.filter(
                        id => id.toString() !== validToken._id.toString()
                    );
                    chat.admin.push(adminChat);
                } else {
                    await ChatModule.findByIdAndDelete(idChat);
                    await UserModule.updateMany(
                        { _id: { $in: chat.users } },
                        { $pull: { chat: idChat } }
                    );
                }
            } else {
                chat.users = chat.users.filter(
                    id => id.toString() !== validToken._id.toString()
                );
                user.chat = user.chat.filter(
                    id => id.toString() !== idChat.toString()
                );
            }

            await chat.save();
            await user.save();

            return true;
        } catch (err) {
            console.error(err);
        }
    }

    async messagePostSave(idChat, message, tokenA, tokenR) {
        try {
            const validToken = await Tokens.validTokens(tokenA, tokenR);

            if (!validToken) {
                return { index: 'token', error: 'false token' };
            }

            const chatSetting = await ChatModule.findById(idChat);
            if (!chatSetting) {
                return { index: 'chat', error: 'false chat' };
            }

            const isAdmin = chatSetting.admin.some(
                adminId => adminId.toString() === validToken._id.toString()
            );

            if (!chatSetting.settings.write && !isAdmin) {
                return { index: 'message', error: 'false message' };
            }

            const messageObj = {
                sender: validToken._id,
                content: message.content,
                type: message.type || 'text',
            };

            chatSetting.message.push(messageObj);
            await chatSetting.save();

            return true;
        } catch (err) {
            console.error(err);
        }
    }

    async messageDeleteServer(idChat, idMessage, tokenA, tokenR) {
        try {
            const validToken = await Tokens.validTokens(tokenA, tokenR);

            if (!validToken) {
                return { index: 'token', error: 'false token' };
            }

            const chat = await ChatModule.findOne(
                { _id: idChat, 'message._id': idMessage },
                { 'message.$': 1, admin: 1 }
            );

            if (!chat || !chat.message.length) {
                return { index: 'message', error: 'false message' };
            }

            const msg = chat.message[0];

            const isMessage = msg.sender.toString() === validToken._id.toString();
            const isAdmin = chat.admin.some(
                adminId => adminId.toString() === validToken._id.toString()
            );

            if (!isMessage && !isAdmin) {
                return { index: 'message', error: 'false message' };
            }

            await ChatModule.updateOne(
                { _id: idChat },
                { $pull: { message: { _id: idMessage } } }
            );

            return true;
        } catch (err) {
            console.error(err);
        }
    }

    async chatGetServer(idChat, tokenA, tokenR) {
        try {
            const validToken = await Tokens.validTokens(tokenA, tokenR);

            if (!validToken) {
                return { index: 'token', error: 'false token' };
            }

            const existingChat = await ChatModule.findOne({
                _id: idChat,
                users: { $in: [validToken._id] }
            });

            if (!existingChat) {
                return { index: 'chat', error: 'false chat' };
            }

            await existingChat
                .populate('users', 'username')
                .populate('admin', 'username')
                .populate('message.sender', 'username');

            return existingChat;
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = new MessageServer();
