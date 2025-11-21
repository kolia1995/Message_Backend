const MessageServer = require('../server/messageServer.js');

class MessageControllers {
    async chatSave(req, res, next) {
        try {
            const {name, user, isGroup, message} = req.body;
            const {accessToken, refreshToken} = req.cookies;

            const chatSaveData = await MessageServer.chatSaveServer(
                name,
                user,
                isGroup,
                message,
                accessToken,
                refreshToken,
            );

            if (chatSaveData?.error) {
                return res.status(400).json(chatSaveData);
            };

            return res.status(200).json({ success: true, ...chatSaveData });
        }
        catch (err) {
            console.error('Chat save error:', err);
            next(err);
        };
    };

    async chatExit(req, res, next) {
        try {
            const {idChat, isGroup} = req.body;
            const {accessToken, refreshToken} = req.cookies;

            const chatDeleteData = await MessageServer.chatExitServer(
                idChat,
                isGroup,
                accessToken,
                refreshToken
            );

            if (chatDeleteData?.error) {
                return res.status(400).json(chatDeleteData);
            }

            return res.status(200).json({ success: true  });
        }
        catch (err) {
            console.error('Chat save error:', err);
            next(err);
        };
    };

    async messagePost(req, res, next) {
        try {
            const { idChat, message } = req.body;
            const { accessToken, refreshToken } = req.cookies;

            const messagePostData = await MessageServer.messagePostSave(
                idChat,
                message,
                accessToken,
                refreshToken,
            );

            if (messagePostData.error) {
                return res.status(400).json(messagePostData);
            };

            return res.status(200).json({ success: true });
        }
        catch (err) {
            console.error('Chat save error:', err);
            next(err);
        };
    };

    async messageDelete(req, res, next) {
        try {
            const { idChat, idMessage } = req.body;
            const { accessToken, refreshToken } = req.cookies;

            const messagePostData = await MessageServer.messageDeleteServer(
                idChat,
                idMessage,
                accessToken,
                refreshToken
            );

            if (messagePostData.error) {
                return res.status(400).json({
                    index: messagePostData.index,
                    error: messagePostData.error,
                });
            };

            return res.status(200).json({ uccess: true });
        }
        catch (err) {
            console.error('Chat save error:', err);
            next(err);
        };
    };

    async chatGet(req, res, next) {
        try {
            const idChat = req.params.id;
            const {accessToken, refreshToken} = req.cookies;
            
            const chatGetData = await MessageServer.chatGetServer(
                idChat,
                accessToken,
                refreshToken,
            );

            if (chatGetData.error) {
                return res.status(400).json({
                    index: chatGetData.index,
                    error: chatGetData.error,
                });
            };

            return res.status(200).json({ success: true, chat: chatGetData });
        }
        catch (err) {
            console.error('Chat save error:', err);
            next(err);
        };
    };
};

module.exports = new MessageControllers();