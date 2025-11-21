const UserModule = require('../modules/userModule.js');

class FriendClass {
    constructor(idUser, idFriend) {
        this.idUser = idUser;
        this.idFriend = idFriend;
    }

    async friendAddServer() {
        try {
            const user = await UserModule.findById(this.idUser);
            const friend = await UserModule.findById(this.idFriend);

            if (!user || !friend) return false;

            await UserModule.updateOne(
                { _id: user._id },
                { $addToSet: { following: friend._id } }
            );

            await UserModule.updateOne(
                { _id: friend._id },
                { $addToSet: { friendRequests: user._id } }
            );

            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async friendAccepServer() {
        try {
            const user = await UserModule.findById(this.idUser);
            const friend = await UserModule.findById(this.idFriend);

            if (!user || !friend) return false;

            await UserModule.updateOne(
                { _id: user._id },
                {
                    $pull: { following: friend._id },
                    $addToSet: { followers: friend._id },
                }
            );

            await UserModule.updateOne(
                { _id: friend._id },
                {
                    $pull: { friendRequests: user._id },
                    $addToSet: { followers: user._id },
                }
            );

            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async friendDeclineServer() {
        try {
            const user = await UserModule.findById(this.idUser);
            const friend = await UserModule.findById(this.idFriend);

            if (!user || !friend) return false;

            await UserModule.updateOne(
                { _id: user._id },
                { $pull: { following: friend._id } }
            );

            await UserModule.updateOne(
                { _id: friend._id },
                { $pull: { friendRequests: user._id } }
            );

            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async friendBlockedServer() {
        try {
            const user = await UserModule.findById(this.idUser);
            const friend = await UserModule.findById(this.idFriend);

            if (!user || !friend) return false;

            const friendInfoBlock = await UserModule.findOne({
                _id: user._id,
                blocked: { $in: [friend._id] },
            });

            if (friendInfoBlock) {
                await UserModule.updateOne(
                    { _id: user._id },
                    { $pull: { blocked: friend._id } }
                );
            } else {
                await UserModule.updateOne(
                    { _id: user._id },
                    {
                        $pull: {
                            following: friend._id,
                            followers: friend._id,
                            friendRequests: friend._id,
                        },
                        $addToSet: { blocked: friend._id },
                    }
                );

                await UserModule.updateOne(
                    { _id: friend._id },
                    {
                        $pull: {
                            following: user._id,
                            followers: user._id,
                            friendRequests: user._id,
                        },
                    }
                );
            }

            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async friendGetList(friendBool, idUser) {
        try {
            const targetUser = await UserModule.findById(this.idUser);
            const currentUser = await UserModule.findById(idUser);

            if (!targetUser) return [];

            const list = friendBool ? targetUser.followers || [] : targetUser.following || [];
            const info = await UserModule.find({ _id: { $in: list } });

            return info.map(friend => {
                const status = {
                    iFollow: currentUser.following?.includes(friend._id) || false,
                    iSentRequest: currentUser.friendRequests?.includes(friend._id) || false,
                    hasSentRequest: friend.friendRequests?.includes(currentUser._id) || false,
                    iBlocked: currentUser.blocked?.includes(friend._id) || false,
                    hasBlocked: friend.blocked?.includes(currentUser._id) || false,
                };

                const relation = (() => {
                    if (status.iBlocked || status.hasBlocked) return "blocked";
                    if (status.iFollow && friend.following?.includes(currentUser._id)) return "friends";
                    if (status.iSentRequest) return "request_sent";
                    if (status.hasSentRequest) return "request_received";
                    if (status.iFollow) return "following";
                    if (friend.following?.includes(currentUser._id)) return "follower";
                    return "none";
                })();

                return {
                    _id: friend._id,
                    user: friend.username,
                    relation,
                    status,
                };
            });
        } catch (err) {
            console.error(err);
            return [];
        }
    }
}

module.exports = FriendClass;
