const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const userRoutes = require('./routes/user.routes');
const recordRoutes = require('./routes/records.routes');
const dashboardRoutes = require('./routes/dashboard.routes')

dotenv.config();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use("/users", userRoutes);
app.use("/records", recordRoutes);
app.use('/dashboard', dashboardRoutes);


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





