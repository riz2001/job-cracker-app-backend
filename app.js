const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const userModel = require("./models/users");
const adminModel = require("./models/admin");
const jobModel = require("./models/job");
const registrationModel = require("./models/registration");

let app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://rizwan2001:rizwan2001@cluster0.6ucejfl.mongodb.net/preg?retryWrites=true&w=majority&appName=Cluster0");

// User Sign-In
app.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (user) {
            const passwordValid = bcrypt.compareSync(password, user.password);
            if (passwordValid) {
                const token = jwt.sign({ userId: user._id }, "placementapp", { expiresIn: "1d" });
                res.json({ "status": "success", "token": token });
            } else {
                res.json({ "status": "incorrect password" });
            }
        } else {
            res.json({ "status": "invalid email id" });
        }
    } catch (error) {
        res.json({ "status": "error", "message": error.message });
    }
});

// User Sign-Up
app.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            res.json({ "status": "email id already exists" });
        } else {
            req.body.password = hashedPassword;
            const newUser = new userModel(req.body);
            await newUser.save();
            res.json({ "status": "success" });
        }
    } catch (error) {
        res.json({ "status": "error", "message": error.message });
    }
});

// Register Job
app.post("/RegisterJob", async (req, res) => {
    const token = req.headers.token;
    try {
        const decoded = jwt.verify(token, "placementapp");

        const existingRegistration = await registrationModel.findOne({
            user_id: decoded.userId,
            job_id: req.body.job_id
        });

        if (existingRegistration) {
            return res.json({ "status": "already registered" });
        }

        const registration = new registrationModel({
            user_id: decoded.userId,
            job_id: req.body.job_id,
        });

        await registration.save();
        res.json({ "status": "success", "registration": registration });

    } catch (error) {
        res.json({ "status": "error", "message": error.message });
    }
});

// Admin Sign-In
app.post("/AdminSignIn", async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await adminModel.findOne({ username });

        if (admin) {
            const passwordValid = bcrypt.compareSync(password, admin.password);
            if (passwordValid) {
                const token = jwt.sign({ userId: admin._id }, "placementapp", { expiresIn: "1d" });
                res.json({ "status": "success", "token": token });
            } else {
                res.json({ "status": "incorrect password" });
            }
        } else {
            res.json({ "status": "invalid username" });
        }
    } catch (error) {
        res.json({ "status": "error", "message": error.message });
    }
});

// Admin Sign-Up
app.post("/AdminSignUp", async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);

        const existingAdmin = await adminModel.findOne({ username });
        if (existingAdmin) {
            res.json({ "status": "Username already exists" });
        } else {
            req.body.password = hashedPassword;
            const newAdmin = new adminModel(req.body);
            await newAdmin.save();
            res.json({ "status": "success" });
        }
    } catch (error) {
        res.json({ "status": "error", "message": error.message });
    }
});

// Add Job
app.post("/AddJob", async (req, res) => {
    const token = req.headers.token;
    try {
        const decoded = jwt.verify(token, "placementapp");
        const newJob = new jobModel(req.body);
        await newJob.save();
        res.json({ "status": "success", "job": newJob });
    } catch (error) {
        res.json({ "status": "error", "message": error.message });
    }
});

// View All Jobs
app.post("/ViewAllJob", async (req, res) => {
    const token = req.headers.token;
    try {
        jwt.verify(token, "placementapp");
        const jobs = await jobModel.find();
        res.json(jobs);
    } catch (error) {
        res.json({ "status": "invalid authentication", "message": error.message });
    }
});

// View Registrations
app.get("/ViewRegistrations", async (req, res) => {
    const token = req.headers.token;
    try {
        jwt.verify(token, "placementapp");
        const registrations = await registrationModel.find()
            .populate({
                path: 'user_id',
                select: 'name admissionno phoneno email'
            })
            .populate({
                path: 'job_id',
                select: 'title'
            });

        res.json({ "status": "success", "registrations": registrations });
    } catch (error) {
        res.json({ "status": "error", "message": error.message });
    }
});

app.listen(3030, () => {
    console.log("Server started on port 3030");
});