// libraries
const sharp = require('sharp');
// import models
const { User } = require('../models/user');
const { sendWelcomeEmail, CancellationEmail } = require('../emails/account');

exports.postUsers = async (req, res, next) => {
    const user = new User(req.body);

    // method 1
    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (err) {
        res.status(400).send(err);
    }

    // method 2
    // user.save().then((data) => {
    //     res.status(201).send(data);
    // }).catch(err => {
    //     res.status(400).send({ ...err });
    // });
};

exports.getUsers = async (req, res, next) => {
    res.send(req.user);

    // method 2
    // try {
    //     let users = await User.find({});
    //     res.status(200).send(users);
    // } catch (err) {
    //     res.status(500).send({ ...err });
    // }

    // method 1
    // User.find({}).then((data) => {
    //     res.status(200).send(data);
    // }).catch((err) => {
    //     res.status(500).send({ ...err });
    // });
};

exports.getUsersById = async (req, res, next) => {
    const { id: _id = "" } = req.params;

    try {
        let user = await User.findById(_id);
        if (!user) {
            return res.status(404).send();
        }
        res.status(404).send(user);

    } catch (err) {
        res.status(500).send({ ...err });
    }

    // User.findById(_id).then((data) => {
    //     if (!data) {
    //         return res.status(404).send();
    //     }
    //     res.status(200).send(data);
    // }).catch((err) => {
    //     res.status(500).send({ ...err });
    // });
};

exports.updateUser = async (req, res, next) => {
    const updates = Object.keys(req.body);
    const fields = ["name", "email", "password", "age"];

    // check if every object keys matches the fields
    const isValidOperation = updates.every((update) => fields.includes(update));
    // get invalid field
    const invalidFeild = !isValidOperation && updates.find(update => !fields.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({ error: `Invalid field: ${invalidFeild}!` });
    }

    try {
        // const { id: _id = "" } = req.params;
        // const user = await User.findById(req.user._id);
        updates.forEach(update => req.user[update] = req.body[update]); //user.key = newUser.value
        await req.user.save();
        // const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });

        // if (!user) {
        //     return res.status(404).send();
        // }

        res.send(req.user);

    } catch (err) {
        res.status(400).send({ ...err });
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        // const { id: _id = "" } = req.params;
        // let user = await User.findByIdAndDelete(req.user._id);
        // if (!user) {
        //     res.status(404).send();
        // }
        await req.user.remove();
        CancellationEmail(req.user.email, req.user.name)
        res.send(req.user);
    } catch (err) {
        res.status(500).send({ ...err });
    }
};

exports.userLogin = async (req, res, next) => {
    try {
        const { email = "", password = "" } = req.body;
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();
        res.send({ user: user, token });
    } catch (err) {
        res.status(400).send();
    }
};

exports.userLogout = async (req, res, next) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
        await req.user.save();
        res.send("logout");
    } catch (err) {
        res.status(500).send();
    }
};

exports.userLogoutAll = async (req, res, next) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (err) {
        res.status(500).send();
    }
};

exports.userFileErrorHandler = (error, req, res, next) => {
    res.status(400).send({ error: error.message });
};

exports.userAvatar = async (req, res, next) => {
    // dest: 'public/images/avatars', => commenting this line from multer enables us to get the file properties here
    const buffer = await sharp(req.file.buffer)
        .resize(
            {
                width: 250,
                height: 250
            }
        )
        .png()
        .toBuffer();

    req.user.avatar = buffer;
    await req.user.save();
    res.send();
};

exports.getUserAvatar = async (req, res, next) => {
    try {
        const { id: _id = "" } = req.params;
        const user = await User.findById(_id);
        if (!user || !user.avatar) {
            throw new Error("Cannot find user");
        }

        res.set('Content-Type', 'image/png'); //change to png after re sharping it
        res.send(user.avatar);
    } catch (err) {
        res.status(400).send();
    }
};

exports.userAvatarDelete = async (req, res, next) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
};

// exports.userDocument = async (req, res, next) => {
//     //dest: 'public/documents' =>  commenting this line from multer enables us to get the file properties here
//     // req.user.file = req.file.buffer;
//     // await req.user.save();
//     res.send();
// };