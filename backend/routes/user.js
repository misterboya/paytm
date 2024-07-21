const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");
const { User } = require("../db");
const router = express.Router();

const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string().trim().min(6, {message: "minimum 6 characters required"}),
    firstName: zod.string(),
    lastName: zod.string()
})

const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string().trim().min(6, {message: "minimum 6 characters required"})
})

router.post("/signup", async function(req, res) {
    const body = req.body;
    const {success} = signupSchema.safeParse(body);
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }
    const user = await User.findOne({
        username: body.username    
    })

    if (user) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })  
    }

    const dbUser = await User.create(body);
    const token = jwt.sign({
        userId: dbUser._id
    }, JWT_SECRET)

    res.json({
        message: "User created successfully",
        token: token
    })

})

router.post("/signin", async (req, res) => {
    const body = req.body;
    const success = signinSchema.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: body.username    
    })

    if (!user) {
        return res.status(411).json({
            message: "Email not found / Please sign up before signin"
        })  
    }

    const userid = await User.findOne({
        userId: body._id
    })
    const token = jwt.sign({
        userid
    }, JWT_SECRET)

    res.json({
        token: token
    })
})

module.exports = router;