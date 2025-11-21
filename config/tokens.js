const jwt = require('jsonwebtoken');
const TokenModule = require('../modules/tokensModule.js');

class Tokens {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.ACCESS_KEY, { expiresIn: '30m' });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_KEY, { expiresIn: '30d' });

        return { accessToken, refreshToken };
    }

    async saveTokens(userId, refreshToken) {
        return await TokenModule.findOneAndUpdate(
            { user: userId },
            { refreshToken },
            { upsert: true, new: true }
        );
    }

    async validTokens(tokenA, tokenR) {
        try {
            const validAccess = jwt.verify(tokenA, process.env.ACCESS_KEY);
            return { ...validAccess };
        } catch (errAccess) {
            try {
                const validRefresh = jwt.verify(tokenR, process.env.REFRESH_KEY);

                const dbToken = await TokenModule.findOne({ user: validRefresh._id });
                if (!dbToken || dbToken.refreshToken !== tokenR) return false;

                const newToken = this.generateTokens({
                    _id: validRefresh._id,
                    username: validRefresh.username,
                    email: validRefresh.email,
                });

                await this.saveTokens(validRefresh._id, newToken.refreshToken);

                return { ...validRefresh, ...newToken };
            } catch (errRefresh) {
                console.error('Token validation error:', errRefresh.message);
                return false;
            }
        }
    }

    async deleteTokens(tokenA) {
        try {
            const validUser = jwt.verify(tokenA, process.env.ACCESS_KEY);
            return await TokenModule.deleteOne({ user: validUser._id });
        } catch (err) {
            console.error('Delete token error:', err.message);
            return null;
        }
    }
}

module.exports = new Tokens();
