const { 
    createUser, 
    deleteUser, 
    allUser, 
    oneUser
} = require('../controllers/userController');

const router = require('express').Router();
const upload = require('../middleware/multer');

router.post('/user', upload.single('image'), createUser);
router.delete('/user/:id', deleteUser);
router.get('/user', allUser);
router.get('/user/:id', oneUser);

module.exports = router;