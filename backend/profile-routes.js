import Router from "express"

const profileRouter = Router()

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect("/auth/login")
  } else {
    next()
  }
}

profileRouter.get("/", authCheck, (req, res) => {
  res.render("profile", { user: req.user })
})

export default profileRouter
