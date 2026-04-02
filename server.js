const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const userRoutes = require('./routes/user.routes');

dotenv.config();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use("/users", userRoutes);


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