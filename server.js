import express from "express";

const app = express();
import dotenv from 'dotenv'
dotenv.config()
import 'express-async-errors'
import morgan from 'morgan'
import connectDB from "./db/connect.js";
import authRoutes from "./routes/authRoutes.js";
import jobsRoutes from "./routes/jobsRoutes.js";

import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import authenticateUser from "./middleware/auth.js";

if (process.env.NODE_ENV !== "production")
{
  app.use(morgan('dev'))
  }
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Welcome");
});

app.use('/api/v1/auth', authRoutes);
app.use("/api/v1/jobs",authenticateUser, jobsRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port, () => {
          console.log(`Server listening ${port}`);
        });

    } catch (error) {
        console.log(error);
    }
}

start()