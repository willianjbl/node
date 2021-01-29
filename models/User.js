import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

userSchema.plugin(passportLocalMongoose, {usernameField: 'email'});

// userSchema.pre('save', async function(next) {
//     next();
// });

const User = mongoose.model('User', userSchema);

export default User;
