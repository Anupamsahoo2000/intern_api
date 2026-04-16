const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
    let { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).send("Need all fields to register");
    }

    try {
        let existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ msg: "User with this email already exists" });
        }

        // hash the pass
        let salt = await bcrypt.genSalt(10);
        let hashed = await bcrypt.hash(password, salt);

        let createdUser = await User.create({
            username: username,
            email: email,
            password_hash: hashed
        });

        const token = jwt.sign({ id: createdUser.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({
            user: { id: createdUser.id, username: createdUser.username, email: createdUser.email },
            token: token
        });

    } catch (err) {
        console.log("register err", err);
        res.status(500).send("Internal server error");
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const u = await User.findOne({ where: { email } });
        if (!u) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const match = await bcrypt.compare(password, u.password_hash);
        if (!match) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        let generatedToken = jwt.sign({ id: u.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            user: { id: u.id, username: u.username },
            token: generatedToken
        });

    } catch (err) {
        console.log(err);
        res.status(500).send("server error");
    }
};

module.exports = {
    register,
    login
};
