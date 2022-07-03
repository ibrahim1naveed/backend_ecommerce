const express = require('express');
const app = express();
const PORT = 5000;
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');
const orderRoute = require('./routes/order');

dotenv.config();

// Connecting to the databse.
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connection Successful to the DB"))
    .catch((err) => console.error(err));

app.use(express.json());

// ROUTES
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/product", productRoute);
app.use("/api/order", orderRoute);

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is connected and listening at port ${PORT}`);
})