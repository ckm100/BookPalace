var bCrypt = require("bcrypt-nodejs");

module.exports = function (passport, LocalStrategy, User) {


    passport.use("login", new LocalStrategy({

        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true

    }, function (req, email, password, done) {

        var isValidPassword = function (user, password) {
            return bCrypt.compareSync(password, user.upassword);
        }

        User.findOne({
            "uemail": email
        }, function (err, user) {

            if (err) {

                return done(err);
            }
            if (!user) {

                return done(null, false, req.flash("message", "0"));
            }

            if (!isValidPassword(user, password)) {

                return done(null, false, req.flash("message", "1"));

            } else {

                return done(null, user);

            }

        });

    }));


}
