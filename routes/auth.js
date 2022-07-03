const express = require('express');
const router = express.Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

// ROUTES

// REGISTERS A USER
// METHOD : POST
// PUBLIC
router.post("/register", async (req,res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET.toString()),
    });

    try {
        const savedUser = await newUser.save();
        res.status(200).json(savedUser);
    } catch (error) {
        res.status(500).json(error);
    }
});

// LOGINS A USER
// METHOD : POST
// PUBLIC
router.post("/login", async (req,res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            res.status(401).json({ msg: "User Not Found!" });
        }

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SECRET);

        const enteredPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        enteredPassword !== req.body.password && res.status(401).json({ msg: "Incorrect Password"}); 
        
        // Username is correct and so is the password! Prepare to send a jwt.
        const accessToken = jwt.sign(
        {
            id: user._id,
            isAdmin: user.isAdmin
        },
        process.env.JWT_SECRET,
        {expiresIn: "3d"}
        );

        const { password, ...others } = user._doc; //mongodb stores our data inside ._doc!

        res.status(200).json({ ...others, accessToken });
        
    } catch (error) {
        res.status(500).json(error);
    }
})



module.exports = router;