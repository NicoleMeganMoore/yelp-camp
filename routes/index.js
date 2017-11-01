var express      = require("express"),
    router       = express.Router(),
    passport     = require("passport"),
    middleware   = require("../middleware"),
    User         = require("../models/user");

var adminCode = process.env.ADMINCODE;

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

//SHOW a user profile
router.get("/users/:id", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err || !foundUser){
            req.flash("error", "Something went wrong");
            res.redirect("/campgrounds");
        }
        res.render("users/show", {user: foundUser});
    });
});

//EDIT - show edit form for user profile
router.get("/users/:id/edit", middleware.checkProfileOwnership, function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        console.log(foundUser);
        res.render("users/edit", {user: foundUser});
    });
});


//UPDATE - update profile page info
router.put("/users/:id", middleware.checkProfileOwnership, function(req, res){
    var currentUser = req.body.user;
    if(req.body.adminCode === adminCode){
        currentUser.isAdmin = true;
    }
    if(req.body.adminCode && req.body.adminCode !== adminCode){
        req.flash("error", "Incorrect admin code, please try again or leave it blank");
        return res.redirect("back");
    }
    
    User.findByIdAndUpdate(req.params.id, currentUser, function(err, user){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Profile Successfully Updated!");
            res.redirect("/users/" + user._id);
        }
    });
});

module.exports = router;
