const express = require("express");
const router = express.Router();
const { ensureAuth} = require("../middlewares/auth");
const Story = require("../models/Story");


//@desc story/ show add page
//@route GET /stories/add
router.get("/add", ensureAuth, (req, res)=>{

    res.render("stories/add", {});
});

//@desc story/ show add page
//@route POST /stories/add
router.post("/add", ensureAuth, async (req, res)=>{

    try{
        req.body.user = req.user.id
        await Story.create(req.body);
        res.redirect("/dashboard");
    }catch(err){
        console.error(err);
        res.render("error/500");
    }



    // res.render("stories/add", {});
});

//@desc Dashboard page
//@route GET /dashboard
router.get("/", ensureAuth, async (req, res)=>{

    try{
        const stories = await Story.find({status: "public"})
                .populate("user")
                .sort({createdAt: "desc"})
                .lean()

    res.render("stories/", {stories});

    }catch(err){
        console.error(err);
        res.render("error/500")
    }
});


//@desc story/ show edit page
//@route post /stories/edit/:id

router.get("/edit/:id", ensureAuth, async (req, res)=>{

    try{
        
        const story = await Story.findOne({
            _id: req.params.id
        }).lean()

        if(!story){
            return res.render("error/404");
        }
        
        if(story.user != req.user.id){
            res.redirect("/stories");
        }else{
            res.render("stories/edit", {story});
        }

    }catch(err){
        console.error(err);
        return res.render("error/500");
    }

    // res.render("stories/edit", {});
});

//@desc story/ update story
//@route put /stories/
router.put("/:id", ensureAuth, async (req, res)=>{

    try{

        
    let story = await Story.findById(req.params.id).lean()

    if(!story){
        return res.render("error/404");
    }

      
    if(story.user != req.user.id){
        res.redirect("/stories");
    }else{
        story = await Story.findOneAndUpdate({_id: req.params.id}, req.body, {
            new: true,
            runValidators: true
        });

        res.redirect("/dashboard");

        // res.render("stories/edit", {story});
    }


    }catch(err){
        console.error(err);
        return res.render("error/500");

    }

});

//@desc story/ delete story page
//@route DELETE /stories/:id
router.delete("/:id", ensureAuth, async(req, res)=>{

    try{
        await Story.remove({_id: req.params.id})
        res.redirect("/dashboard");
    }catch(err){
        console.error(err);
        return res.render("error/500")
    }
    // res.render("stories/add", {});
});

//@desc story/ show single story
//@route GET /stories/:id
router.get("/:id", ensureAuth, async (req, res)=>{
    try{
        let story = await Story.findById({_id: req.params.id}).populate("user").lean()

        if(!story){
            return res.render("error/404");
        }

        res.render("stories/show", {
            story
        });

    }catch(err){
        console.error(err);
        res.render("error/404");
    }

});


//@desc story/ user stories
//@route GET /stories/user/:userId
router.get("/user/:userId", ensureAuth, async (req, res)=>{
    try{
        const stories = await Story.find({
            user: req.params.userId,
            status: "public"
        })
        .populate("user")
        .lean()

        res.render("stories/index", {stories});

    }catch(err){
        console.error(err);
        res.render("error/500");
    }
    // res.render("stories/add", {});
});



module.exports = router;