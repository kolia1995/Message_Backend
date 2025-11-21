# Message_Backend

**Message_Backend** is the backend part of a messaging application built with Node.js and MongoDB.  
The project supports individual and group chats, administrative features, user management, and token-based authentication.

---

## Features

### Users & Authentication
- User registration and management
- Generation of Access and Refresh tokens using JWT
- Token validation and automatic Access Token renewal via Refresh Token

### Chats
- Private (1-to-1) and group chats
- Storing messages of different types (`text`, `image`, `file`, `system`)
- Ability to edit and delete messages
- Configurable permissions for writing, media, links, and invitations

### Administrative Features
- Add/remove chat administrators
- Block/unblock users in group chats
- Configure group chat permissions (`write`, `media`, `links`, `invite`)

### Security
- JWT-based authentication for routes
- Refresh tokens stored in the database
- Token validation for protected operations

---

## Technologies
- Node.js
- Express.js
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- cookie-parser
- dotenv (for environment variables)
- nodemon (recommended for development)

---

## Project Structure

- Node.js
- Express.js
- MongoDB + Mongoose
- JSON Web Tokens
- Cookie-parser

---

## Message_Backend
- controllers/ # Controllers for handling API requests
-  modules/ # Modules for interacting with the database
- routes/ # API route definitions
- server/ # Server logic and services (MessageServer, AdminChatServer)
- config/ # Configuration files, including token and environment setup
- models/ # Mongoose schemas (Chat, Message, User, Tokens)
- .env.example # Example environment variables file
- app.js # Main server entry point

---

## License
MIT License
