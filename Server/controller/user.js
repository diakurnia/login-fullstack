const User = require('../model/user')

exports.getAllUser =  async (req,res) => {
    try{
        const users = await User.find()
        res.json(users)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

exports.getUserById = (req,res) => {
    res.json(res.user)
}

exports.postNewUser = async (req,res) => {
    if(req.body.password === req.body.password2){
        const user = new User(req.body)
        try {
            await user.save()
            const token = await user.generateAuthToken()
            res.status(201).send({user, token})
        } catch (err){
            res.status(400).json({message:err.message})
        }
    }
}

// exports.postNewUser = async (req,res) => {
//     const user = new User(req.body)
//         try {
//             await user.save()
//             const token = await user.generateAuthToken()
//             res.status(201).send({user, token})
//         } catch (err){
//             res.status(400).json({message:err.message})
//         }
// }

exports.updateUser = async (req, res) => {
    if (req.body.username != null) {
        res.user.username = req.body.username
    }
    if (req.body.email != null) {
        res.user.email = req.body.email
    }
    try {
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    } catch(err) {
        res.status(400).json({message: err.message})
    }
}

exports.deleteUser = async (req, res) => {
    try {
        await res.user.remove()
        res.json({message: "user is deleted"})
    } catch(err) {
        res.status(500).json({message: err.message})
    }
}

exports.userLogin = async(req, res)=>{
    try{
        const{email,password} = req.body
        const user = await User.findByCredentials(email,password)
        if(!user){
            return res.status(401).send({message: 'login failed!'})
        }
        const token = await user.generateAuthToken()
        res.send({token})
    } catch (err){
        res.status(400).send({message:'bed request'})
    }
}



exports.getUserByToken = (req, res) => {  
    res.send(req.user)
  }


exports.userLogout =  async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send()
    } catch (err) {
        res.status(500).send(err)
    }
}