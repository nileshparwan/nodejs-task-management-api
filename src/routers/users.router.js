const express = require('express');
const router = new express.Router();

const usersController = require('../controllers/user.controller');
const { auth } = require('../middleware/auth');
const { uploadAvatar /*, uploadDocument*/ } = require('../utils/fileUpload');

router.post('/users', usersController.postUsers);
router.get('/users/me', auth, usersController.getUsers);
router.get('/users/:id', usersController.getUsersById);
router.patch("/users/me", auth, usersController.updateUser);
router.delete("/users/me", auth, usersController.deleteUser);
router.post("/users/login", usersController.userLogin);
router.post("/users/logout", auth, usersController.userLogout);
router.post("/users/logoutAll", auth, usersController.userLogoutAll);

// error handler here is taking message from (new Error('')); 
// avatar here is the input name
router.post("/users/me/avatar", auth, uploadAvatar.single('avatar'), usersController.userAvatar, usersController.userFileErrorHandler);

router.delete("/users/me/avatar", auth, usersController.userAvatarDelete);
router.get("/users/:id/avatar", usersController.getUserAvatar);

// error handler here is taking message from (new Error('')); 
// document here is the input name
// router.post("/users/me/file", auth, uploadDocument.single('document'), usersController.userDocument, usersController.userFileErrorHandler);


module.exports = router;