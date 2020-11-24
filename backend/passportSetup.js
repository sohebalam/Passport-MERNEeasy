import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
// import keys from "./keys"
import User from "./user-model.js"

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user)
  })
})

passport.use(
  new GoogleStrategy(
    {
      // options for google strategy
      clientID:
        "130210432692-8dujh2mskmmpa0ij50imvvmuv0e7b322.apps.googleusercontent.com",
      clientSecret: "wyg0ZiGagZJ0Jm2u-Z556K8E",
      callbackURL: "/auth/google/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
      // check if user already exists in our own db
      User.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
          // already have this user
          console.log("user is: ", currentUser)
          done(null, currentUser)
        } else {
          // if not, create user in our db
          new User({
            googleId: profile.id,
            username: profile.displayName,
            thumbnail: profile._json.image.url,
          })
            .save()
            .then((newUser) => {
              console.log("created new user: ", newUser)
              done(null, newUser)
            })
        }
      })
    }
  )
)

export default GoogleStrategy
