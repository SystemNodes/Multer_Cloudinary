const router = require('express').Router();
const { 
    addProduct, 
    allProducts, 
    oneProduct,
    addProductImages,
    deleteProduct,
    replaceProductImage
} = require('../controllers/productController');
const upload = require('../middleware/multer');

router.post('/product', upload.array('images', 5), addProduct);
router.get('/product', allProducts);
router.get('/product', oneProduct);
router.delete('/product/:id', deleteProduct);
router.post('/product/:id/images', upload.array('images', 5), addProductImages);
router.put("/product:id/images/:imageId", upload.single("image"), replaceProductImage);


module.exports = router;
