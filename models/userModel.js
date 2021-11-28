const mongoose=require('mongoose');
const {func} = require("joi");
const Schema=mongoose.Schema;
const Joi = require('joi');
const createError = require('http-errors')
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const UserSchema=new Schema({
    isim:{
        type:String,
        required:true,
        trim:true,
        minlength:3
    },
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minlength:3,
        maxlength:50
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true
    },
    sifre:{
        type:String,
        minlength:6,
        required:true,
        trim:true

    },
    isAdmin:{
        type:Boolean,
        default:false
    }
},{collection:'kullanicilar',timestamps:true});

const schema=Joi.object({
    isim:Joi.string().min(3).max(50).trim(),
    username:Joi.string().min(3).max(50).trim(),
    email:Joi.string().trim().email(),
    sifre:Joi.string().min(6).trim()
});

UserSchema.methods.generateToken= async function () {
    const girisYapanUser=this; // metodu çağıran user in kendisi.
    return await jwt.sign({_id:girisYapanUser._id},'secretkey',{expiresIn: '1h'});

}


// yeni bir user için validation
UserSchema.methods.joiValidation=function(userObject){

    schema.required();
    return schema.validate(userObject);
}



//Kullanıcıya gösterirken bazı alanların görünmesini istemezsek.
//toJSON metodu mongoose un içinde var.
UserSchema.methods.toJSON=function () {
    const user=this.toObject();//this yani gelen kişiyi objeye çevir.
    delete user._id;
    delete user.createdAt;
    delete user.updatedAt;
    delete user.sifre;
    delete user.__v;

    return user;
}
//update için validation
UserSchema.statics.joiValidationForUpdate=function(userObject){

    return schema.validate(userObject);
}

UserSchema.statics.girisYap=async (email,sifre) => {

    const {error,value}=schema.validate({email,sifre});
    if(error){
        throw createError(400,error);
    }
    const user=await User.findOne({email:email});

    if(!user){
        throw  createError(400,"Girilen email veya şifre hatalı");
    }

    const sifreKontrol=await bcrypt.compare(sifre,user.sifre);

    if(!sifreKontrol){
        throw  createError(400,"Girilen email veya şifre hatalı");
    }

    return user;

}

const User=mongoose.model('User',UserSchema);


module.exports=User;