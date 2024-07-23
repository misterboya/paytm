const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const JWT_SECRET  = require("../config");
const { authMiddleware } = require("../middleware");
const { User } = require("../db");
const router = express.Router();
const { ObjectId } = require("mongodb"); 

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
    const {success} = signinSchema.safeParse(req.body);
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

    const token = jwt.sign({user}, JWT_SECRET)
   
    res.json({
        token: token
    })
})

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
})

router.put("/:id", authMiddleware, async (req, res) => {
    const {success} = updateBody.safeParse(req.body);
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }
    
    await User.updateOne({
        _id: req.params.id}, 
        {
        $set: req.body
    })
    
    res.status(200).json({
        message: "update successfull !"
    });
})

module.exports = router;