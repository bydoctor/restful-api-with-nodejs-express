const hataYakalayici=(err,req,res,next)=>{

    //console.log(err)
    if(err.code===11000){ //duplicate error
        res.status(400);
        return res.json({ // aşağı doğru çalışmaması için return ile bitirdik.
            mesaj:Object.keys(err.keyValue)+" için girdiğiniz "+Object.values(err.keyValue)+" değeri daha önceden veri tabanında olduğu için tekrar eklenemez/güncellenemez, unique olmalıdır.",
            hataKodu:400

        })
    }

    if(err.code===66){ //değiştirilemeyen alan id mesela
        res.status(400);
        return res.json({
            mesaj:err.codeName+" Değiştirilemeyen bir alanı güncellemeye çalıştınız",
            hataKodu:400

        })
    }
    if(err.name==="ValidationError"){
        res.status(err.status)
        return res.json({
            mesaj:err.details[0].message,
            hataKodu:err.status
        })
    }

    if(err.name==='JsonWebTokenError'){
        res.status(err.status)
        return  res.json({
            mesaj:err.message,
            hataKodu:err.status
    })
    }
    res.status(err.status)
    return  res.json({
        mesaj:err,
        hataKodu:err.status
    })



}

module.exports=hataYakalayici;