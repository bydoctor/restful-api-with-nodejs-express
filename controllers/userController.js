const User = require("../models/userModel");
const createError = require('http-errors')
const bcrypt=require('bcrypt');

const tumUserlariListele=async (req,res,next)=>{
    try {
        const tumUserlar=await User.find({});
        res.json(tumUserlar);
    }catch (e) {
        next(createError(401,e));
    }
}

const oturumAcanKullaniciBilgileri=(req,res,next)=>{

    res.json(req.user);

};

const oturumAcanKullaniciBilgileriGuncelleme=async (req,res,next)=>{

    // delete ile sildiğimiz alanlar patch ile değiştirilmesini istemediğimiz alanlar.FindOneAndUpdate() e gelmeden bu alanları sileriz.
    delete req.body.createdAt;
    delete req.body.updatedAt;

    if(req.body.hasOwnProperty('sifre')){
        req.body.sifre=await bcrypt.hash(req.body.sifre,10);
    }
    const {error,value}=User.joiValidationForUpdate(req.body);
    if(error){
        next(createError(400,error));
    }else{
        try {
            User.findOneAndUpdate()
            //runValidators:true ifadesi veritabanında aynı değere sahip bir alan varsa veya belirlediğimiz kısıtlamalara uymasını istiyorsak onu kontrol eder.Mesela username veya isim 3 karakterden az olmasın gibi.
            const sonuc=await User.findByIdAndUpdate({_id:req.user._id},req.body,{new:true,runValidators:true});
            if(sonuc){
                return res.status(200).json(sonuc);
            }else{
                return res.status(404).json({
                    mesaj:"Kullanıcı bulunamadı",
                })
            }

        }catch (e) {
            next(e);
        }
    }


};

const yeniKullaniciOlustur=async (req,res,next)=>{
    try {
        const eklenecekUser=new User(req.body);
        eklenecekUser.sifre=await bcrypt.hash(eklenecekUser.sifre,10);
        const { error,value } = eklenecekUser.joiValidation(req.body);
        if(error){
            next(createError(400,error));
            // console.log("user kaydederken hata: "+error);
        }else{
            const sonuc=await eklenecekUser.save();
            res.json(sonuc);
        }
    }catch (err) {
        next(err);
        //console.log("user kaydederken hata: "+err);
    }
};

const girisYap=async (req,res,next)=>{
    try {
        const user=await User.girisYap(req.body.email,req.body.sifre);
        const token=await user.generateToken();
        res.json({
            user,
            token
        });


    }catch (e) {
        next(e);
    }
}

const kullaniciGuncelleme=async (req,res,next)=>{
    // delete ile sildiğimiz alanlar patch ile değiştirilmesini istemediğimiz alanlar.FindOneAndUpdate() e gelmeden bu alanları sileriz.
    delete req.body.createdAt;
    delete req.body.updatedAt;

    if(req.body.hasOwnProperty('sifre')){
        req.body.sifre=await bcrypt.hash(req.body.sifre,10);
    }
    const {error,value}=User.joiValidationForUpdate(req.body);
    if(error){
        next(createError(400,error));
    }else{
        try {
            User.findOneAndUpdate()
            //runValidators:true ifadesi veritabanında aynı değere sahip bir alan varsa veya belirlediğimiz kısıtlamalara uymasını istiyorsak onu kontrol eder.Mesela username veya isim 3 karakterden az olmasın gibi.
            const sonuc=await User.findByIdAndUpdate({_id:req.params.id},req.body,{new:true,runValidators:true});
            if(sonuc){
                return res.status(200).json(sonuc);
            }else{
                return res.status(404).json({
                    mesaj:"Kullanıcı bulunamadı",
                })
            }

        }catch (e) {
            next(e);
        }
    }


}

const tumKullancilariSil=async (req,res,next)=>{

    try {
        const sonuc= await User.deleteMany({isAdmin:false});
        if(sonuc){
            res.status(200).json({
                mesaj:"Tüm Kullanıcılar silindi",
            });
        }else{
            return res.status(404).json({
                mesaj:"Kullanıcı bulunamadı",
            })

            //throw createError(404,"Kullanıcı bulunamadı");
        }
    }catch (e){
        next(e); //hata çıkarsa hatamiddlewarine  yönlendir
    }
}

const kullaniciKendiniSil=async (req,res,next)=>{

    try {
        const sonuc= await User.findByIdAndDelete({_id:req.user._id});
        if(sonuc){
            res.status(200).json({
                mesaj:"Kullanıcı silindi",
            });
        }else{
            return res.status(404).json({
                mesaj:"Kullanıcı bulunamadı",
            })

            //throw createError(404,"Kullanıcı bulunamadı");
        }
    }catch (e){
        next(e); //hata çıkarsa hatamiddlewarine  yönlendir
    }
}

const adminKullaniciSil=async (req,res,next)=>{

    try {
        const sonuc= await User.findByIdAndDelete({_id:req.params.id});
        if(sonuc){
            res.status(200).json({
                mesaj:"Kullanıcı silindi",
            });
        }else{
            return res.status(404).json({
                mesaj:"Kullanıcı bulunamadı",
            })

            //throw createError(404,"Kullanıcı bulunamadı");
        }
    }catch (e){
        next(e); //hata çıkarsa hatamiddlewarine  yönlendir
    }
}

module.exports= {
    tumUserlariListele,
    oturumAcanKullaniciBilgileri,
    oturumAcanKullaniciBilgileriGuncelleme,
    yeniKullaniciOlustur,
    girisYap,
    kullaniciGuncelleme,
    tumKullancilariSil,
    kullaniciKendiniSil,
    adminKullaniciSil
}