const User = require('../models/user.models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET_KEY

module.exports = {

    registerUser: async (req, res) =>{
        console.log(req.body)
        try{
            const newUser = await User.create(req.body);
            console.log('new usewr', newUser)
            const userToken = jwt.sign({_id:newUser._id}, SECRET)
            res.status(201).cookie('userToken', userToken, {httpOnly:true, expires:new Date(Date.now() + 60000)})
            .json({successMessage:"Usuario registrado ", id:newUser._id})
            //console.log("userto", userToken)
        }catch(error){
            res.status(401).json(error)
        }
    },

    loginUser: async (req, res)=>{
        const user = await User.findOne({email:req.body.email})
        console.log(" login user is and secret", SECRET )
        if(!user){
            	console.log('loginUser: no se encuentra el user id')
		res.status(401).json({error: "Incorrect credentials, try again..."})
        }
        try{
            const validPass = await bcrypt.compare(req.body.password, user.password )
            console.log('loginUser: pass valida')
            if(!validPass){
                console.log('loginUser try: pass invalido' ,validPass);
		res.status(401).json({error: "Incorrect credentials, try again..."})
            }else{
                const userToken = jwt.sign({_id:user._id}, SECRET)
                console.log('loginUser: pass valido', userToken)
		console.log('check SECRET loginUser', SECRET)    
                res.status(201).cookie('userToken', userToken, {httpOnly:false, expires:new Date(Date.now() + 1800000)}).json({successMessage:"User login OK ", id: user._id})
            }
        }catch(error){
	    console.log('loginUser catch:', error);
            res.status(400).json({error: error})
        }
    },
    logOutUser:(req,res)=>{
        res.clearCookie('userToken')
        res.json({success:'User logout'})
    },
    getUserbyID : async (req, res)=>{
        console.log('get user by id server', req.params.id);
        const user = await User.findOne({ _id: req.params.id })
        try{
            res.status(201).json( {user : user })
        }
        catch(error){
            res.status(400).json({error: error})
        }
        
    },
    addAddressbyID: async (req, res)=>{
        console.log('add addr by id', req.body.addresses);
        const user = await User.findOneAndUpdate(  
        { _id: req.params.id},
        { $push: { addresses: req.body.addresses } },).exec()
        try{
            res.status(201).json( {user : user })
        }
        catch(error){
            res.status(400).json({error: error})
        }
        
    },
    updateAddressbyID: async (req, res)=>{
        console.log('update add by id', req.params.id);
        const user = await User.findOneAndUpdate(  
        { _id: req.params.id, 'addresses._id': req.params.addrid},
        { $set: {"addresses.$" :req.body.addresses}  },)
        try{
            res.status(201).json( {user : user })
        }
        catch(error){
            res.status(400).json({error: error})
        }},
    updateUserNoPass : async( req, res) => {
        console.log('update user NO PASS', req.params.id);
        const user = await User.findOneAndUpdate(  
            { _id: req.params.id},
            { $set: {"firstName" : req.body.firstName, "lastName":  req.body.lastName,
            "email": req.body.email, "addresses" : req.body.addresses}})
            try{
                res.status(201).json( {user : user })
            }
            catch{
                res.status(400).json({error: error})
            }
    },
    updateUserByID : async(req, res) =>{
        console.log('update all user props WITH PASS', req.params.id);
        const user = await User.findOneAndUpdate(  
            { _id: req.params.id},
            req.body,
            {runValidators: true})
        try{
            res.status(201).json( {user : user })
        }
        catch{
            res.status(400).json({error: error})
        }
    },
    getUser: (req, res) => {
        console.log('test')
    },
    verUser: (req, res) =>{
 
        res.status(201).json( {user : 'test successful' })


    }
    
}        
