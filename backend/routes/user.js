const express = require('express');
const zod = require("zod");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const {authMiddleware} = require("../middleware");

const router = express.Router();

const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
})

router.post("/signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body)
    if (!success){
        return res.status(404).json({
            message: "not found"
        })
    }
    const existingUser = await User.findOne({
        username: req.body.username,
    })
    if (existingUser){
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName

    })
    const userId = user._id;

    const token = jwt.sign({
        userId: userId
    }, JWT_SECRET);

    res.status(200).json({
        message: "User created successfully",
        token: token
    })


})

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
        if (!success){
            return res.status(411).json({
                message: "Error while logging in"
            })
        }

        const user = await User.findOne({
            username: req.body.username,
            password: req.body.password,
        })

    if(user){
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
        return res.status(200).json({
            token: token
        })
    }

    res.status(411).json({
        message: "Error while logging in"
    })



})

const updateBody = zod.object({
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
})

router.put("/",authMiddleware(), async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne({_id: req.userId}, req.body);

    return res.status(200).json({
        message: "Successfully updated successfully",
    })


})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
});

router.post("/signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / incorrect inputs"        
        })
}

    const existingUser = await User.findOne({ username: req.body.username })

    if (existingUser){
        res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await User.create({
        username: req.body.username,
        firstNmae: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password
    })

    const userTd = user._id;

    // creating new acount

await Account.create({
    iserId,
    balance: 1 + Math.random() * 10000
})


///---------------------


const token = jwt.sign({
    userId,
    }, JWT_SECRET);

res.json({
    message: "User created successfully",
    token: token
})
})

module.exports = router;