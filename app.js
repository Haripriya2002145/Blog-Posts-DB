const bodyParser = require("body-parser");
const express = require("express");
//const ejs = require("ejs");
const _ = require("lodash");
const mongoose=require('mongoose');
const app = express();


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("public/assets"));

const homeStartingContent = "This is the home starting content. I want to start a day with freshness. I want to remind myself of the days when I got expected results for that hard work. But also want to remind myself of the hard work I have to do to achieve them. Let's start with mindful quotes for the day.";
const aboutStartingContent = "I am Haripriya from Chennai, studying at SRM Institute of Science and Technology. I'm pursuing my bachelor course in Computer Science Engineering.";
const contactStartingContent = "Use this ID: haripriya2002145@gmail.com to contact me.";

//let posts = [];

//Mongoose part
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const postSchema={
    title: String,
    content: String
}

const Post=mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
    //res.render("home", { homeText: homeStartingContent, allPosts: posts });

    Post.find({})
        .then(function(posts){
            res.render("home", { homeText: homeStartingContent, allPosts: posts });
        })
        .catch(function(err){
            console.log(err);
        })
})

app.get("/home", function (req, res) {
    Post.find({})
        .then(function(posts){
            res.render("home", { homeText: homeStartingContent, allPosts: posts });
        })
        .catch(function(err){
            console.log(err);
        })
})

app.get("/about", (req, res) => {
    res.render("about", { aboutContent: aboutStartingContent, imgSrc: "pic.png" });
})

app.get("/contact", function (req, res) {
    res.render("contact", { contactContent: contactStartingContent });
})

app.get("/compose", function (req, res) {
    res.render("compose");
})

app.post("/compose", (req, res) => {
    const title = req.body.postTitle;
    const content = req.body.postBody;
    
    const post=new Post({
        title: title,
        content: content
    })
    post.save()
        .catch(function(err){
            console.log(err);
        });

    // const post = {
    //     title1: title,
    //     content1: content
    // }

    // posts.push(post);
    console.log(post);

    res.redirect("/");
})


app.get("/posts/:postID", (req, res) => {

    const requestedID = req.params.postID;
    
    var matched=0;
    // Post.forEach(function (post) {
    //     const storedID = _.lowerCase(post.title);
        
    //     if (requestedID === storedID) {
    //         //console.log("Match found!");
    //         //res.redirect("/");
    //         matched=1;
    //         console.log("Match found!");
    //         res.render("post", {postTitle: post.title, postContent: post.content});
    //     }
    // }
    // );

    Post.find({_id: requestedID})
        .then(function(post){  
            console.log(post);
            if(post.length!=0){
                matched=1;
                console.log("Match found!");
                res.render("post", {postTitle: post[0].title, postContent: post[0].content});
            }
            else{
                console.log("Match not found!");
        
                res.redirect("/");
            }
        })
        .catch(function(err){
            console.log(err);
        })

    
})





app.listen(8000, () => {
    console.log("Server started on port 8000");
})

