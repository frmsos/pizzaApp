const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    userID:{
            type: String,
            unique: false,
            required: true
        },
    typeOrder: {
        type: String,
        required: [ true, "Debe ingresar un nuevo tipo de pedido"],
    },
    address: {
                street: {
                    type: String,
                    required: function() { return(this.typeOrder === 'Delivery'); } 
                },
                lat: {
                    type: Number,
                    required: function() { return(this.typeOrder === 'Delivery'); } 
                },
                lng: {
                    type: Number,
                    required: function() { return(this.typeOrder === 'Delivery'); } 
                },
                _id : {
                    type: String,
                    required: false,
                    unique: false
                }
        },
    items: [
        {
            amount: {
                type: Number,
                required: [true, "Debe ingresar una cantidad de pizzas"],
            },
            crust: {
                type: String,
                required: [true, "Debe ingresar el tipo de masa"]
            },
            size: {
                type: String,
                required: [true, "Debe ingresar el size de la pizza"]
            },
            topping: {
                type: String,
                required: [true, "Debe ingresar el sabor de la pizza"]
            }
        }
    ]
    });
    module.exports = mongoose.model('orders', orderSchema);