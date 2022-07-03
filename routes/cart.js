const express = require('express');
const router = express.Router();

// ROUTES
const Cart = require('../models/Cart');
const middleware = require('./middleware/verifyToken');

// ROUTES
// CREATES A Cart
router.post("/", middleware.verifyToken, async (req,res) => {
    const newCart = new Cart(req.body);

    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (error) {
        res.status(500).json(error);
    }
})


// UPDATES A Cart
// METHOD : PUT
// PUBLIC
router.put("/:id", middleware.verifyTokenAndAuthorization, async (req,res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new:true})
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json(error);
    }
});

// ROUTES
// DELETES A CART
// METHOD : DELETE
// PUBLIC
router.delete("/:id", middleware.verifyTokenAndAuthorization, async (req,res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json({ msg: "Cart has been deleted..." });
    } catch (error) {
        res.status(500).json(error);
    }
});

// ROUTES
// GET USER CART
// METHOD : GET
// PUBLIC
router.get("/find/:userId", middleware.verifyTokenAndAuthorization, async (req,res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET ALL - ALL CARTS OF ALL USERS.

router.get("/", middleware.verifyTokenAndAdmin, (req,res) => {
    try {
        const allCarts = await Cart.find();
        res.status(200).json(allCarts);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;