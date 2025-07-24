import express from 'express';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import './utils/connection.js';
import userRoute from './routes/user.route.js'

// initialize the app
const app = express();

// Load environment variables
configDotenv();

// initialize the port
const PORT  = process.env.PORT || 8001;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());

// test route
app.get('/', (req,res) => {
    res.send("Hello Server Is Running")
});

// routes
app.use('/api/user', userRoute);

// run the server
app.listen(PORT, () => console.log(`Server runing on PORT: ${PORT}`));