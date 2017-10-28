var mongoose    = require("mongoose");
var Campground  = require("./models/campgrounds");
var Comment     = require("./models/comment");

var data = [
    {
        name: "Cloud's Rest",
        image: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?w=1500&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
        description: "Let's make a nice big leafy tree. I get carried away with this brush cleaning. Those great big fluffy clouds. You can create anything that makes you happy. I spend a lot of time walking around in the woods and talking to trees, and squirrels, and little rabbits and stuff. The more we do this - the more it will do good things to our heart. That's a son of a gun of a cloud. We'll do another happy little painting. Be brave."
    }, 
    {
        name: "Canyon Floor",
        image: "https://images.unsplash.com/photo-1484960055659-a39d25adcb3c?w=1500&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
        description: "Let's make a nice big leafy tree. I get carried away with this brush cleaning. Those great big fluffy clouds. You can create anything that makes you happy. I spend a lot of time walking around in the woods and talking to trees, and squirrels, and little rabbits and stuff. The more we do this - the more it will do good things to our heart. That's a son of a gun of a cloud. We'll do another happy little painting. Be brave."
    }, 
    {
        name: "Desert Mesa",
        image: "https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=1506&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
        description: "Let's make a nice big leafy tree. I get carried away with this brush cleaning. Those great big fluffy clouds. You can create anything that makes you happy. I spend a lot of time walking around in the woods and talking to trees, and squirrels, and little rabbits and stuff. The more we do this - the more it will do good things to our heart. That's a son of a gun of a cloud. We'll do another happy little painting. Be brave."
    }
]

function seedDB(){
    Campground.remove({}, function (err){
        if(err){
            console.log(err);
        } else {
            console.log("removed campgrounds!");
            data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err);
                } else {
                    console.log("added a campground!");
                    Comment.create({
                        text: "This place is great, but I wish there was internet",
                        author: "Homer"
                    }, function(err, comment){
                        if(err){
                            console.log(err);
                        } else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log("created new comment!");
                        }
                    });
                }
            });
        });
        }
    });
}

module.exports = seedDB;