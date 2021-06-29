
const { model, Schema } = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Task } = require('./task');

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email');
                }
            }
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 6,
            validate(value) {
                if (value?.toLowerCase()?.includes("password")) {
                    throw new Error('password cannot contain "password"');
                }
            }
        },
        age: {
            type: Number,
            default: 0,
            validate(value) {
                if (value < 0) {
                    throw new Error("Age must be a positive number");
                }
            }
        },
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }],
        avatar: {
            type: Buffer
        },
        file: {
            type: Buffer
        }
    },
    {
        timestamps: true // false by default
    }
);

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id', // local field is where the local data is stored 
    foreignField: 'owner' // the foreign field is the name of the field on the other thing. On tasks it is going the relationship between user and task
});

// middleware 
// custom function for token
userSchema.methods.generateAuthToken = async function () {
    const user = this; // here this&user ==== User
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    user.tokens = [...user.tokens, { token }];
    await user.save();
    return token;
};

// hiding private data
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    delete userObject.file;
    return userObject;
};

// custom middleware function for mongo
userSchema.statics.findByCredentials = async (email, password) => {
    // find user by email
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Unable to login");
    }

    // decrypt hash password and check if login password is correct
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Unable to login");
    }

    // return user if password matches
    return user;
};

// build in function
// hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this; // here this&user ==== User

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

// delete user tasks when user is removed
userSchema.pre('removed', async function (next) {
    const user = this;
    await Task.deleteMany({ owner: user._id });
    next();
});

const User = model('User', userSchema);

module.exports = { User };

