const jwt=require('jsonwebtoken');
const createError=require('http-errors');
const User=require('../models/userModel')

const auth= async (req,res,next)=>{
try {
    if(req.header('Authorization')){
        const token=req.header('Authorization').replace('Bearer ',''); //bearer+boşluk u kaldır sadece token kalsın.
        const sonuc=jwt.verify(token,'secretkey');

        const bulunanUser=await User.findById({_id: sonuc._id});
        if(bulunanUser){
            req.user=bulunanUser;
        }else{

            throw createError(401,'Lütfen giriş yapın')
        }
        next()
    }else{
        throw new Error('Lütfen giriş yapın')
    }

}catch (e) {
    next(e)
}

}

module.exports=auth;