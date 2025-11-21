const bcrypt = require('bcrypt');

const UserModule = require('../modules/userModule.js');
const CandidatModule = require('../modules/candidatModule.js');

const UserDto = require('../dto/user-dtos.js');

const Email = require('../config/email.js');
const Tokens = require('../config/tokens.js');
const Friend = require('../utils/friend.js');

class UserServer {
    async registerServer(user, email, pass) {
        try {
            const userFromUser = await UserModule.findOne({ username: user });
            const userFromCandidat = await CandidatModule.findOne({ username: user });

            if (userFromUser || userFromCandidat) {
                return {
                    index: 'user',
                    error: 'false user',
                };
            };

            const emailFromUser = await UserModule.findOne({ email: email });
            const emailFromCandidat = await CandidatModule.findOne({ email: email });

            if (emailFromUser || emailFromCandidat) {
                return {
                    index: 'email',
                    error: 'false email',
                };
            };

            const activationCode = await Email.sendActivationCode(email);
            const passHash = await bcrypt.hash(pass, 10);
            
            const newCandidat = await CandidatModule.create({
                username: user,
                email: email,
                password: passHash,
                code: activationCode,
            });

            return { userId: newCandidat._id };
        }
        catch (err) {
            console.error(err);
            return {
                index: 'server',
                error: 'false server',
            };
        };
    };
    async activateServer(code, userId, resend) {
        try {
            const existingUserId = await CandidatModule.findById(userId);

            if (!existingUserId) {
                return {
                    index: 'userId',
                    error: 'false userId',
                };
            };

            if (resend) {
                const emailResult = await Email.sendActivationCode(existingUserId.email);

                existingUserId.code = emailResult;
                existingUserId.save();

                return {
                    index: 'code_resend',
                };
            };

            if (existingUserId.code !== code) {
                 return {
                    index: 'code',
                    error: 'false code',
                };
            };

            const user = await UserModule.create({
                username: existingUserId.username,
                email: existingUserId.email,
                password: existingUserId.password,
            });

            await CandidatModule.deleteOne({_id: existingUserId._id});

            const userDto = new UserDto(user);
            const tokens = Tokens.generateTokens({...userDto});

            await Tokens.saveTokens(userDto._id, tokens.refreshToken);

            return {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                user: userDto,
            };
        }
        catch (err) {
            console.error('Activation error:', err.message);
        };
    };

    async loginServer(login, pass) {
        try {
            const loginFromUser = await UserModule.findOne({
                $or: [
                    {username: login},
                    {email: login},
                ]
            });

            if (!loginFromUser) {
                return {
                    index: 'login',
                    error: 'false login'
                };
            };

            if (!loginFromUser.password) {
                return {
                    index: 'pass',
                    error: 'false pass',      
                };
            };

            const passCompare = await bcrypt.compare(pass, loginFromUser.password);

            if (!passCompare) {
                return {
                    index: 'pass',
                    error: 'false pass',
                };
            };

            const userDto = new UserDto(loginFromUser);
            const tokens = Tokens.generateTokens({...userDto});

            await Tokens.saveTokens(userDto._id, tokens.refreshToken);

            return {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                user: userDto,
            };
        }
        catch (err) {
            console.error('Login error:', err);
        };
    };
    async logoutServer(tokenA) {
        try { 
            const deleted  = await Tokens.deleteTokens(tokenA);
            
            if (!deleted) {
                return {
                    index: 'token',
                    error: 'false token',
                };
            };
            
            return true;
        }
        catch (err) {
            console.error(err);
        };
    };

    async friendServer(idFriend, action , tokenA, tokenR) {
        try {
            const validToken = await Tokens.validTokens(tokenA, tokenR);

            if (!validToken) {
                return {
                    index: 'token',
                    error: 'false token',
                };
            };

            const newFriend = new Friend(validToken._id, idFriend);
            let result = false;

            switch(action) {
                case 'add':
                    result = await newFriend.friendAddServer();
                break;
                case 'accept':
                    result = await newFriend.friendAccepServer();
                break;
                case 'decline':
                    result = await newFriend.friendDeclineServer();
                break;
                case 'block':
                    result = await newFriend.friendBlockedServer();
                break;
            }

            if (!result) {
                return {
                    index: 'freind',
                    error: 'false friend',
                }
            }

            return true;
        }
        catch (err) {
              console.error('friendServer error:', err);
        };
    };

    async friendListServer(idUser, friendBool, tokenA, tokenR) {
        try {
            const validToken = await Tokens.validTokens(tokenA, tokenR);

            if (!validToken) {
                return {
                    index: 'token',
                    error: 'false token',
                };
            };

            const newFriend = new Friend(idUser);
            const friendListInfo = await newFriend.friendGetList(friendBool, validToken._id);

            return friendListInfo;
        }
        catch (err) {
            console.error('friendServer error:', err);
        };
    };

    async userGetServer(tokenA, tokenR) {
        try {
            const validToken = await Tokens.validTokens(tokenA, tokenR);

            if (!validToken) {
                return {
                    index: "error",
                    error: "false token"
                };
            };

            const user = await UserModule.findById(validToken._id)
                .populate({
                    path: 'chat',
                    populate: [
                        { path: 'users', select: 'username' },
                        { path: 'message.sender', select: 'username' }
                    ]
                });
  
            const chatMas = user.chat.map(chat => {
                if (!chat) return null;

                let name = chat.name || chat.users.find(u => u._id.toString() !== validToken._id.toString())?.username;

                let lastMessage = chat.message[chat.message.length - 1];
                let messageContent = lastMessage?.content || null;
                let messageUser = lastMessage?.sender?.username || null;
                let messageDate = lastMessage?.timestamp || null;

                return {
                    idChat: chat._id,
                    name,
                    messageContent,
                    messageUser,
                    messageDate,
                    lengUser: chat.users.length,
                };
            });

            return {
                user: user.username,
                followers: user.followers.map(f => f.username),
                following: user.following.map(f => f.username),
                friendRequests: user.friendRequests.map(f => f.username),
                blocked: user.blocked.map(f => f.username),
                chatMas,
            };
        }
        catch (err) {
            console.error(err);
        };
    };
};

module.exports = new UserServer();