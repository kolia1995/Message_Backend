const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const User = require('./routers/userRouter.js');
const Message = require('./routers/messageRouter.js');
const AdminChat = require('./routers/adminChatRouter.js');

const ConnectMongo = require('./config/db.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const methodCors = {
    origin: '*',
    credentials: true,
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(methodCors));

ConnectMongo();

app.use('/api/user', User); //1
app.use('/api/message', Message); 
app.use('/api/adminChat', AdminChat);

app.listen(PORT, () => console.log('http://localhost:5000'));