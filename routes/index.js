var express      = require("express"),
    router       = express.Router(),
    passport     = require("passport"),
    User         = require("../models/user");

router.get("/", function(req,res){
   res.render("landing"); 
});

//Show register form
router.get("/register", function(req, res){
    res.render("register", {page: "register"});
});

//signup logic
router.post("/register", function(req, res){
    var newUser = new User({
        username: req.body.username, 
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
    });
    var adminCode = process.env.ADMINCODE;
    if(req.body.adminCode === adminCode){
        newUser.isAdmin = true;
    }
    if(req.body.adminCode && req.body.adminCode !== adminCode){
        req.flash("error", "Incorrect admin code, please try again or leave it blank");
        return res.redirect("back");
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp, " + user.firstName + "!");
            res.redirect("/campgrounds");
        });
    });
});

//Show login form
router.get("/login", function(req, res){
    res.render("login", {page: "login"});
});

//Handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        successFlash: "Login successful.",
        failureFlash: "Incorrect username and password combination. Please try again."
    }), function(req, res){
});

//Handling logout logic
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

//User profiles
router.get("/users/:id", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err || !foundUser){
            req.flash("error", "Something went wrong");
            res.redirect("/campgrounds");
        }
        res.render("users/show", {user: foundUser});
    });
});

module.exports = router;
