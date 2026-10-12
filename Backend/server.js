import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database/db.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';
import chatRoute from './chatbot/chatRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(express.json());

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
}));

app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use('/api/chat', chatRoute);
app.use('/user', userRoutes);

connectDB()
    .then(() => {
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    });
