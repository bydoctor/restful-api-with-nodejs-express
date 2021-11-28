const router=require('express').Router();

const authMiddleware=require('../middleware/authMiddleware');
const adminMiddleware=require('../middleware/adminMiddleware');
const userController=require('../controllers/userController')

// tüm kullanıcıları sadece adminler listeyebilsin.
router.get('/',[authMiddleware,adminMiddleware],userController.tumUserlariListele)

//oturum açan kullanıcı bilgilerini listeler
router.get('/me',authMiddleware,userController.oturumAcanKullaniciBilgileri)

//oturum açan kullanıcı bilgileri güncelleme işlemleri
router.patch('/me',authMiddleware,userController.oturumAcanKullaniciBilgileriGuncelleme)

//yeni kullanıcı oluşturma
router.post('/',userController.yeniKullaniciOlustur)

//Giriş yapma işlemi
router.post('/giris',userController.girisYap)

//Kullanıcı güncelleme
router.patch('/:id',userController.kullaniciGuncelleme)

//admin tarafından tüm kullanıcıları silme
router.get('/deleteAll',[authMiddleware,adminMiddleware],userController.tumKullancilariSil)

//kullanıcının kendini silmesi
router.delete('/me',authMiddleware,userController.kullaniciKendiniSil)

//admin tarafından kullanıcının silinmesi
router.delete('/:id',[authMiddleware,adminMiddleware],userController.adminKullaniciSil)





module.exports=router;
