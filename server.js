const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser"); // for parsing cookies in request headers

//importing routes
const userRoutes = require('./routes/user.routes');
const recordRoutes = require('./routes/records.routes');
const dashboardRoutes = require('./routes/dashboard.routes')

//load env variables
dotenv.config();


const port = process.env.PORT || 3000;

//middlewares
app.use(express.json());
app.use(cookieParser());

//routes
app.use("/users", userRoutes);
app.use("/records", recordRoutes);
app.use('/dashboard', dashboardRoutes);

//connecting to database and starting server
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Database connected");

    app.listen(port, () => {
        console.log(`Server is running on ${port}`);
    });

})
.catch((error) => {
    console.log("DB connection failed:", error);
});