const LocalStrategy = require('passport-local').Strategy;
const db = require('./database')

exports.initializingPassport = (passport) => {
    passport.use(new LocalStrategy(async (username, password, done) => {
        try {
            console.log(username);
            console.log(password);
            const user = await db.findOne({ username });
            console.log(user);
            if (!user) {
                return done(null, false);
            }
            if (user.password != password) {

                return done(null, false);
            }
            else {
                return done(null, user);
            }

        } catch (error) {
            return done(null, false);

        }
    })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = db.findById(id)
            done(null, user);
        } catch (error) {

            done(null, false);
        }
    });

};

exports.isAuthenticated = (req, res, next) => {
    if (req.user) return next();
    res.redirect("/login");
}