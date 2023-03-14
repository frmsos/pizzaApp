const UserController = require('../controllers/users.controllers')
const {authenticate} = require('../config/jwt.config')


module.exports = (app) =>{
    app.post('/api/pizzapp/register', UserController.registerUser)
    app.post('/api/pizzapp/login', UserController.loginUser)
    app.get('/api/pizzapp/logout', authenticate, UserController.logOutUser)
    app.get('/api/pizzapp/users/:id', authenticate ,UserController.getUserbyID)
    app.post('/api/pizzapp/users/addresses/:id', authenticate, UserController.addAddressbyID)
    app.put('/api/pizzapp/users/address/:id/:addrid', authenticate, UserController.updateAddressbyID)
    app.put('/api/pizzapp/user/refactor/:id/', authenticate, UserController.updateUserNoPass)
    app.put('/api/pizzapp/user/update/:id/', authenticate, UserController.updateUserByID)
    app.get('/api/pizzapp/auth', authenticate, UserController.getUser)
    app.get('/api/pizzapp/ver', UserController.verUser)
    app.post('/api/pizzapp/users/del/address/:id/:addrid', UserController.deleteAddressbyID)


    
    
    
    

}