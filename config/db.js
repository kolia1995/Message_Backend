const mongoose = require('mongoose');

async function ConnectMongo() {
    try {
        const mongoURL = process.env.MONGO_CONNECT;
        if (!mongoURL) {
            console.error("❌ MONGO_CONNECT is not defined in .env");
            process.exit(1);
        };

        await mongoose.connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true 
        });

        console.log("✅ MongoDB connected successfully");
    }
    catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    };
};

module.exports = ConnectMongo;