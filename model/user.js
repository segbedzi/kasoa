const mongoose = require("mongoose")
const Order = require("./order")

const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required: true
    },
    email : {
        type: String,
        required : true 
    },
    password : {
        type : String,
        required : true
    },
    resetToken : String,
    resetTokenExpiration : Date,
    cart : {
        items : [{
            productId : {
                type : mongoose.Types.ObjectId,
                ref : 'Product'
            },
            quantity : Number
        }]
    }
})

UserSchema.methods.addToCart = function (product) {                       
            const updatedCartItems =  [...this.cart.items]
            const cartItemIndex = updatedCartItems.findIndex( e => e.productId.toString() == product._id.toString());
            let newQuantity = 1;
            if(cartItemIndex >= 0){
                newQuantity =  updatedCartItems[cartItemIndex].quantity + 1;
                updatedCartItems[cartItemIndex].quantity = newQuantity;
            }else{
                updatedCartItems.push({productId : product._id, quantity : 1})
            }
            this.cart.items = updatedCartItems;
          return  this.save();
}

UserSchema.methods.removeItemFromCart = function (productId){
    const updatedCartItems = this.cart.items.filter(i => i.productId != productId);
    this.cart.items = updatedCartItems;
    return this.save()
}

UserSchema.methods.clearCart = function(){
    this.cart = {items : []}
    return this.save();
}
module.exports = mongoose.model("User", UserSchema);




// const getDb = require("../util/database").getDb
// const objectId = require("mongodb").ObjectId;
// const Product = require("./product")

// class User {
//     constructor(name,email,id, cart){
//         this.name = name;
//         this.email = email;
//         this._id = id ? new objectId(id) : null
//         this.cart = cart;
//     }

//     save () {
//         const db = getDb();
//         if(this._id){
//             return db.collection("users").updateOne({_id : this._id}, {$set : this})
//         }else {
//            return db.collection("users").insertOne(this);
//         }
//     }

//     static findById(userId){
//         const db = getDb();
//         return db.collection("users").findOne({_id : new objectId(userId)});

//     }

//     addToCart(product){
//         const db = getDb();
//         const updatedCart = {items : [...this.cart.items]}
//         const cartItemIndex = this.cart.items.findIndex( e => e.productId.toString() == product._id.toString());
//         let newQuantity = 1;
//         if(cartItemIndex >= 0){
//             newQuantity =  updatedCart.items[cartItemIndex].quantity + 1;
//             updatedCart.items[cartItemIndex].quantity = newQuantity;
//         }else{
//             updatedCart.items.push({productId : product._id, quantity : 1})
//         }
//         return db.collection("users").updateOne({_id : this._id},{$set : {cart : updatedCart}}).then((result) => result).catch(err => console.log(err))
//     }

//     getCart(){
//         const db = getDb();
//         const products = this.cart.items.map(e => Product.findById(e.productId));
//        return db.collection("products").find({_id : {
//             $in : this.cart.items.map(i => i.productId)
//         }})
//         .toArray()
//         .then(products => products.map(p => {
//             return {...p, quantity : this.cart.items.find(e => e.productId.toString() == p._id.toString()).quantity}
//         }))    
//      }

//      removeItemFromCart(productId) {
//          const db = getDb();
//          const updatedItems = this.cart.items.filter(e => e.productId.toString() != productId.toString())
//          return db.collection("users").updateOne({_id : this._id},{$set : {cart : {items : updatedItems} }})
//         }
     
//     createOrders() {
//         const db = getDb();
//         return this.getCart()
//         .then(cart => {
//             return {
//                 items : cart,
//                 user : {
//                     name : this.name,
//                     email : this.email,
//                     _id : this._id
//                 }
//             }
//         })
//         .then( order => {
//            return db.collection("orders").insertOne(order)
//         })
//         .then( _ => {
//             this.cart.items = [];
//             return db.collection("users").updateOne({_id : this._id}, {$set : {cart : this.cart}})
//         })
//     }


//     getOrders(){
//         const db = getDb();
//         return db.collection("orders").find({'user._id' :this._id}).toArray()
//     }
// }

// module.exports = User;