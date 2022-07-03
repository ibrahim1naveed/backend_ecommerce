const express = require('express');
const router = express.Router();
const middleware = require('./middleware/verifyToken');
const CryptoJS = require('crypto-js');
const User = require('../models/User');

// ROUTES
// UPDATES A USER
// METHOD : PUT
// PUBLIC
router.put("/:id", middleware.verifyTokenAndAuthorization, async (req,res) => {

    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password, 
            process.env.PASSWORD_SECRET.toString())
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new:true})
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json(error);
    }
});

// ROUTES
// DELETES A USER
// METHOD : DELETE
// PUBLIC
router.delete("/:id", middleware.verifyTokenAndAdmin, async (req,res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ msg: "User has been deleted..." });
    } catch (error) {
        res.status(500).json(error);
    }
});

// ROUTES
// GET USER STATS
// METHOD : GET
// PUBLIC
router.get("/stats", middleware.verifyTokenAndAdmin, async (req,res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() -1));



    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 } // will sum all users.
                }
            }
        ]);
        res.status(200).json(data);
        
    } catch (error) {
        res.status(500).json(error);
    }
})

// ROUTES
// GET A USER
// METHOD : GET
// PUBLIC
router.get("/:id", middleware.verifyTokenAndAdmin, async (req,res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (error) {
        res.status(500).json(error);
    }
});

// ROUTES
// GET ALL USER
// METHOD : GET
// PUBLIC
router.get("/", middleware.verifyTokenAndAdmin, async (req,res) => {
    const query = req.query.new;
    try {
        const users = query ? await User.find().sort({ _id: -1 }).limit(5) : await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
});


module.exports = router;