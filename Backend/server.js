import express from 'express';
import dotenv from 'dotenv';
import dns from 'node:dns';
import mongoose from 'mongoose';
import connectDB from './database/db.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';
import chatRoute from './chatbot/chatRoute.js';

dotenv.config();

const mongoDnsServers = process.env.MONGO_DNS_SERVERS
    ?.split(',')
    .map((server) => server.trim())
    .filter(Boolean);

if (mongoDnsServers?.length) {
    dns.setServers(mongoDnsServers);
}

const app = express();
const PORT = process.env.PORT || 8000;
const allowedOrigins = [
    ...(process.env.CORS_ORIGINS || '').split(','),
    process.env.FRONTEND_URL,
    'https://skcodingschool.vercel.app',
    'http://localhost:3000',
]
    .filter(Boolean)
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map((origin) => {
        try {
            return new URL(origin.trim()).origin;
        } catch {
            throw new Error(`Invalid CORS origin: ${origin}`);
        }
    });

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(new URL(origin).origin)) {
            callback(null, true);
            return;
        }

        callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
}));

app.use(express.json());

app.get('/health', (_req, res) => {
    const databaseConnected = mongoose.connection.readyState === 1;
    res.status(databaseConnected ? 200 : 503).json({
        status: databaseConnected ? 'ok' : 'degraded',
        database: databaseConnected ? 'connected' : 'disconnected',
    });
});

app.use('/api/chat', chatRoute);
app.use('/user', userRoutes);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

connectDB().catch((err) => {
    console.error('Database unavailable; database-backed routes will not work:', err);
});
