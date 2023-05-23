const Gallery = require("../models/galleryModel");

const loadHome = async(req,res)=>{
    try {
        const session = req.session.user_id
        res.render('home',{message:"LOGOUT",check:req.session.user_id});
        
    } catch (error) {
        console.log(error.message);
    }
}

const loadGallery = async (req,res)=>{
    try {
        const galleryData = await Gallery.find({});
        // console.log(galleryData)
        res.render('gallery',{galleryData:galleryData});
    } catch (error) {
        console.log(error.message);
    }
}

const achivement = async (req,res)=>{
    try {
        
        res.render('achivement');
    } catch (error) {

        console.log(error.message);
    }
}

module.exports = {
    loadHome,
    loadGallery,
    achivement,
}