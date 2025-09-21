const router = require('express').Router();
const { 
    addProduct, 
    allProducts, 
    oneProduct,
    addProductImages,
    deleteProduct,
    replaceProductImage,
    replaceMultipleImages
} = require('../controllers/productController');
const upload = require('../middleware/multer');

router.post('/product', upload.array('images', 5), addProduct);
router.get('/product', allProducts);
router.get('/product', oneProduct);
router.delete('/product/:id', deleteProduct);
router.post('/product/:id/images', upload.array('images', 5), addProductImages);
router.put('/product/:id/images/:imageId', upload.single('images'), replaceProductImage);
router.put('/product/:id/images/replace_multiple', upload.array('images', 5), replaceMultipleImages);

module.exports = router;
