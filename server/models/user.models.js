const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
        firstName: {
            type: String,
            required: [true, "Debe ingresar su nombre"],
            minlength: [2, "Su Nombre debe tener como minimo 2 caracteres o mas"]
        },
        lastName: {
            type: String,
            required: [true, "Enter your last name"],
            minlength: [2, "Su Apellido debe tener como minimo 2 caracteres o mas"]
        },
        email: {
            type: String,
            required: [true, "Enter your email"],
            unique: true,
            validate: {
                validator: val => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
                message: "Please enter a valid email address"
            }
        },
        addresses: [
            {
                street: {
                    type: String,
                },
                lat: {
                    type: Number,
                },
                lng: {
                    type: Number,
                }
            }
        ],
        password: {
            type: String,
            required: [true, "Debe ingresar su contraseña"],
            minlength: [5, "Su contraseña debe tener como minimo 5 o mas digitos"]
        },
    }, {timestamps: true});

//middleware
UserSchema.pre('save', async function(next){
    try{
        UserSchema.addresses = undefined;
        const hashedPassword = await bcrypt.hash(this.password, 10)
        console.log(" HashedPassword is: ", hashedPassword)
        this.password = hashedPassword
        next()
    }catch{
        console.log("Error creating user, please try again...", error)
    }
})

UserSchema.pre('findOneAndUpdate', async function (next) {
    try {
        if (this._update.password) {
            const hashed = await bcrypt.hash(this._update.password, 10)
            this._update.password = hashed;
        }
        next();
    } catch (err) {
        return next(err);
    }
});






module.exports = mongoose.model('users', UserSchema)