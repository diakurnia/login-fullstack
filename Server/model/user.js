const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require ('bcryptjs')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email :{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)){
                throw new Error({error: 'Invalid Email Addres'})
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    tokens:[{
        token: {
            type: String,
            required: true
        }
    }],
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    }
})

userSchema.pre('save', async function(next){
    //hash the password before saving the user model
    const user = this 
    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})


userSchema.methods.generateAuthToken = async function (){
    //generate an auth token for the user
    const user = this
    const token = jwt.sign({_id: user._id, username:user.username, password:user.password, email:user.email}, process.env.JWT_KEY)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    //search for a user by email and password
    const user = await User.findOne({email})
    if(!user){
        throw new Error ({ error: 'Invalid login credentials'})
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if(!isPasswordMatch){
        throw new Error({error: 'Invalid Login Credentials'})
    }
    return user
}

const User = mongoose.model('User', userSchema)

module.exports = mongoose.model('user', userSchema)


