import {mongoose} from './index.js';
import bcrypt from 'bcrypt';
const SALT_WORK_FACTOR = 10;
const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    password: {
        type: String,
        required: true
    },
    userRole: {
        type: String,
        required: true
    },
    authyId: {
        type: String,
        required: true
    }
}, {collection: 'UserCollection'});


UserSchema.pre('save', function (next) {
    const user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) 
        return next();
    
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) 
            return next(err);
        
        // hash the password using our new salt
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) 
                return next(err);
            
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) 
            return cb(err);
        cb(null, isMatch);
    });
};

// var autoIncrement = require('mongoose-auto-increment');
// autoIncrement.initialize(mongoose.connection);
// UserSchema.plugin(autoIncrement.plugin, { model: 'UserModel', field: 'userNo'
// });
const UserModel = mongoose.model('UserModel', UserSchema);

export default UserModel;