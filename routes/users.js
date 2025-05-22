var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')
const auth = require('../middleware/auth')
const upload = require('../middleware/uploads')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/getAll', userController.getUsers);
router.get('/me', auth, userController.getMe);
router.put('/updateprofile', auth, upload.single('profile'), userController.updateUser);
module.exports = router;
