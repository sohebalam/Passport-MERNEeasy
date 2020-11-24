import mongoose from "mongoose"
import express from "express"
import cors from "cors"
import passport from "passport"
import { Strategy as passportLocal } from "passport-local"
import cookieParser from "cookie-parser"
import bcrypt from "bcryptjs"
import session from "express-session"
import bodyParser from "body-parser"
const app = express()
import User from "./user.js"
import MyFunc from "./passportConfig.js"
import connectDB from "./db.js"
import dotenv from "dotenv"
dotenv.config({ path: "./config.env" })
//----------------------------------------- END OF IMPORTS---------------------------------------------------

connectDB()

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  cors({
    origin: "http://localhost:3000", // <-- location of the react app were connecting to
    credentials: true,
  })
)
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
)
app.use(cookieParser("secretcode"))
app.use(passport.initialize())
app.use(passport.session())
MyFunc(passport)

//----------------------------------------- END OF MIDDLEWARE---------------------------------------------------

// Routes
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err
    if (!user) res.send("No User Exists")
    else {
      req.logIn(user, (err) => {
        if (err) throw err
        res.send("Successfully Authenticated")
        console.log(req.user)
      })
    }
  })(req, res, next)
})
app.post("/register", (req, res) => {
  User.findOne({ username: req.body.username }, async (err, doc) => {
    if (err) throw err
    if (doc) res.send("User Already Exists")
    if (!doc) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)

      const newUser = new User({
        username: req.body.username,
        password: hashedPassword,
      })
      await newUser.save()
      res.send("User Created")
    }
  })
})
app.get("/user", (req, res) => {
  res.send(req.user) // The req.user stores the entire user that has been authenticated inside of it.
})
//----------------------------------------- END OF ROUTES---------------------------------------------------
//Start Server
app.listen(4000, () => {
  console.log("Server Has Started")
})
