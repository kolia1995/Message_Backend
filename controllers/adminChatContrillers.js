const AdminChatServer = require('../server/adminChatServer.js');

class AdminChatControllers {
    async adminChatAdd(req, res, next) {
        try {
            const { idChat, idUser } = req.body;
            const { accessToken, refreshToken } = req.cookies;

            const adminChatData = await AdminChatServer.adminChatAddServer(
                idChat,
                idUser,
                accessToken,
                refreshToken
            );

            if (adminChatData?.error) {
                return res.status(400).json({
                    index: adminChatData.index,
                    error: adminChatData.error
                });
            }

            return res.status(200).json({ success: true });
        } catch (err) {
            next(err);
        }
    }

    async adminChatGiveAdmin(req, res, next) {
        try {
            const { idChat, idUser } = req.body;
            const { accessToken, refreshToken } = req.cookies;

            const adminChatData = await AdminChatServer.adminChatGiveAdminServer(
                idChat,
                idUser,
                accessToken,
                refreshToken
            );

            if (adminChatData?.error) {
                return res.status(400).json({
                    index: adminChatData.index,
                    error: adminChatData.error
                });
            }

            return res.status(200).json({ success: true });
        } catch (err) {
            next(err);
        }
    }

    async adminChatBlockes(req, res, next) {
        try {
            const { idUser, idChat } = req.body;
            const { accessToken, refreshToken } = req.cookies;

            const adminChatData = await AdminChatServer.adminChatBlockesServer(
                idChat,
                idUser,
                accessToken,
                refreshToken
            );

            if (adminChatData?.error) {
                return res.status(400).json({
                    index: adminChatData.index,
                    error: adminChatData.error
                });
            }

            return res.status(200).json({ success: true });
        } catch (err) {
            next(err);
        }
    }

    async adminChatDelete(req, res, next) {
        try {
            const { idUser, idChat } = req.body;
            const { accessToken, refreshToken } = req.cookies;

            const adminChatData = await AdminChatServer.adminChatDeleteServer(
                idChat,
                idUser,
                accessToken,
                refreshToken
            );

            if (adminChatData?.error) {
                return res.status(400).json({
                    index: adminChatData.index,
                    error: adminChatData.error
                });
            }

            return res.status(200).json({ success: true });
        } catch (err) {
            next(err);
        }
    }

    async adminChatSetting(req, res, next) {
        try {
            const { idChat, canWrite, canMedia, canLinks, canInvite } = req.body;
            const { accessToken, refreshToken } = req.cookies;

            const adminChatData = await AdminChatServer.adminChatSettingServer(
                idChat,
                canWrite,
                canMedia,
                canLinks,
                canInvite,
                accessToken,
                refreshToken
            );

            if (adminChatData?.error) {
                return res.status(400).json({
                    index: adminChatData.index,
                    error: adminChatData.error
                });
            }

            return res.status(200).json({ success: true });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new AdminChatControllers();
