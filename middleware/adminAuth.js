const islogin = async(req,res,next)=>{
    try {
    
       if(req.session.admin_id){
        next();
       }
       else{
        res.redirect('/admin/adminLogin');
       }
      
    } catch (error) {
        console.log(error.message);
    }
};

 const  islogout = async(req,res,next)=>{
    try {
       
        if(req.session.admin_id ){
            res.redirect('/admin/adminDashboard');
        }
       next();
    } catch (error) {
        console.log(error.message)
    }
 }


 module.exports = {
    islogin,
    islogout
}