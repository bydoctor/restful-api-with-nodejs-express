// noinspection JSVoidFunctionReturnValueUsed

const mongoose=require('mongoose');

mongoose.connect("mongodb://localhost/restful_api", { useNewUrlParser: true ,useUnifiedTopology:true,useCreateIndex:true,useFindAndModify:false})
    .then(()=>console.log('Veritabanına bağlanıldı.'))
    .catch(error=>console.log('Db bağlantı hatası'+error));

module.exports