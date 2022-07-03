const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const middleware = require('./middleware/verifyToken');

// ROUTES
// CREATES AN ORDER
router.post("/", middleware.verifyToken, async (req,res) => {
    const newOrder = new Order(req.body);

    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (error) {
        res.status(500).json(error);
    }
})


// UPDATES AN ORDER
// METHOD : PUT
// PUBLIC
router.put("/:id", middleware.verifyTokenAndAdmin, async (req,res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new:true})
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json(error);
    }
});

// ROUTES
// DELETES AN ORDER
// METHOD : DELETE
// PUBLIC
router.delete("/:id", middleware.verifyTokenAndAdmin, async (req,res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json({ msg: "Order has been deleted..." });
    } catch (error) {
        res.status(500).json(error);
    }
});

// ROUTES
// GET USER ORDERS
// METHOD : GET
// PUBLIC
router.get("/find/:userId", middleware.verifyTokenAndAuthorization, async (req,res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET ALL - ALL CARTS OF ALL USERS.

router.get("/", middleware.verifyTokenAndAdmin, async (req,res) => {
    try {
        const allOrders = await Orders.find();
        res.status(200).json(allOrders);
    } catch (error) {
        res.status(500).json(error);
    }
})

// GET MONTHLY INCOME
router.get("/income", middleware.verifyTokenAndAdmin, async(req,res) => {
    const date = new Date;
    const lastMonth = new Date(date.setMonth(date.getMonth()-1));
    const previousMonth = new Date(date.setMonth(lastMonth.getMonth()-1));

    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" } // will sum all users.
                }
            }
        ]);
        res.status(200).json(income);
        
    } catch (error) {
        res.status(500).json(error);
    }
})


module.exports = router;