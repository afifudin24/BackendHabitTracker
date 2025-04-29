var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')
const auth = require('../middleware/auth')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/getAll', userController.getUsers);
router.get('/me', auth, userController.getMe);
module.exports = router;
