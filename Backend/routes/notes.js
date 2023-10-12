const express = require("express");
const router = express.Router();
const Note  = require("../models/Notes");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");


router.post("/addnote",fetchuser,[
    body('title','Enter valid Title name').isLength({min : 3}),
    body('description','describe more').isLength({min : 5})
],async(req,res)=>
{
    try {
        
        const {title,description,tag} = req.body; 
        const errors = validationResult(req);
        if(!errors.isEmpty())
        {
            return res.status(400).json({errors : errors.array});
        }
    
        const note = new Note({
            title,description,tag,user:req.user.id  
        })
        const savednote = await note.save();
        res.json(savednote);

    } catch (error) {
        console.log(error.message);
        res.status(500).send("some error occured");
    }

   
} )
router.get("/fetchallnotes",fetchuser,async(req,res)=>
{
    try {

    const notes = await Note.find({user : req.user.id});
   res.json(notes);

    } catch (error) {
        console.log(error.message);
        res.status(500).send("some error occured");

    }
   
})

router.put("/updatenote/:id",fetchuser,async(req,res)=>
{
    try {
        const {title,description,tag} = req.body;
        let newNote = {};
        if(title){newNote.title = title};
        if(description){newNote.description=description};
        if(tag){newNote.tag=tag};

        let note = await Note.findById(req.params.id);
        if(!note)
        {
            return res.status(404).send("not found");
        }

        if(note.user.toString()!==req.user.id)
        {
            return res.status(401).send("not allowed");
        }
      
        note = await Note.findByIdAndUpdate(req.params.id,{$set : newNote}, {new :true});
        res.json(note);
        
    } catch (error) {
        res.status(404).send("error");
    }
})

router.delete("/deletenote/:id",fetchuser,async(req,res)=>
{
    try {
        let note = await Note.findById(req.params.id);
        if(!note)
        {
            return res.status(404).send("not found");
        }
        
        if(note.user.toString()!==req.user.id)
        {
            return res.status(401).send("not allowed");
        }
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({"success" : "DELETED"});
    } catch (error) {
        console.log(error.message);
        res.status(500).send("some error occured");
    }
})

module.exports = router;