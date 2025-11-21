const UserServer = require('../server/userServer.js');

class UserControllers {

    async register(req, res, next) {
        try {
            const {username, email, password} = req.body;
            const registerData = await UserServer.registerServer(username, email, password);

            if (registerData?.error) {
                return res.status(400).json(registerData);
            };

            return res.status(200).json({ success: true, userId: registerData.userId });
        }
        catch (err) {
            next(err);
        };
    };
    async activate(req, res, next) {
        try {
            const {code, userId, resend} = req.body;

            const activateData = await UserServer.activateServer(code, userId, resend);

            if (activateData?.error) {
                return res.status(400).json(activateData);
            };

            res.cookie('accessToken', activateData.accessToken, {httpOnly: true, maxAge: 30 * 60 * 1000});
            res.cookie('refreshToken', activateData.refreshToken, {httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000});

            return res.status(200).json({
                success: true,
                user: activateData.user,
            });
        }
        catch (err) {
            next(err);
        };
    };

    async login(req, res, next) {
        try {
            const {login, password} = req.body;

            const loginData = await UserServer.loginServer(login, password);

            if (loginData?.error) {
                return res.status(400).json(loginData);
            };

            res.cookie('accessToken', loginData.tokenA, {httpOnly: true, maxAge: 30 * 60 * 1000});
            res.cookie('refreshToken', loginData.tokenR, {httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000});

            return res.status(200).json({ success: true });
        }
        catch (err) {
            next(err);
        };
    };
    async logout(req, res, next) {
        try {
            const { accessToken } = req.body;
            const logoutData = await UserServer.logoutServer(accessToken);
        
            if (logoutData?.error) {
                return res.status(400).json(logoutData);
            };

            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');

            return res.status(200).json({ success: true });
        }
        catch (err) {
            next(err);
        };
    };

    async friend(req, res, next) {
        try {
            const { idFriend, action } = req.body;
            const { accessToken, refreshToken } = req.cookies;
        
            const friendData = await UserServer.friendServer(
                idFriend,
                action,
                accessToken,
                refreshToken,
            );

            if (friendData?.error) {
                return res.status(400).json(friendData);
            };

            return res.status(200).json({ success: true });
        }
        catch (err) {
            next(err);
        }
    };
    async friendList(req, res, next) {
        try {
            const { idUser, friendBool } = req.body;
            const { accessToken, refreshToken } = req.cookies;

            const friendListData = await UserServer.friendListServer(
                idUser,
                friendBool,
                accessToken,
                refreshToken,
            );

            if (friendListData?.error) {
                return res.status(400).json(friendListData);
            };

            return res.status(200).json({ success: true, list: friendListData });
        }
        catch (err) {
            next(err);
        };
    };

    async user(req, res, next) {
        try {
            const {accessToken, refreshToken} = req.cookies;

            const userData = await UserServer.userGetServer(accessToken, refreshToken);

            if (userData?.error) {
                return res.status(400).json(userData);
            };

            res.cookie('accessToken', userData.accessToken, {httpOnly: true, maxAge: 30 * 60 * 1000});
            res.cookie('refreshToken', userData.refreshToken, {httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000});

            return res.status(200).json({
                success: true,
                idUser: userData._id,
                username: userData.username,
                chatId: userData.chatId,
            });
        }
        catch (err) {
            next(err);
        };
    };
};

module.exports = new UserControllers();