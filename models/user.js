const mongodb = require('mongodb');

const getDb = require('../util/database').getDb;
class User{
  constructor(username,email,cart,id){
    this.name=username;
    this.email=email;
    this.cart=cart;
    this._id=id;
  }

  save(){
    const db = getDb();
    return db.collection('users')
    .insertOne(this);
  }

  addToCart(product){ 
    const cartProductIndex = this.cart.findIndex(cp=>{
      return cp.productId.toString()===product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart];

    if(cartProductIndex>=0){
      newQuantity = this.cart[cartProductIndex].quantity+1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    }else{
      updatedCartItems.push({productId:new mongodb.ObjectId(product._id),quantity:newQuantity});
    }
   
    const updatedCart = {items:updatedCartItems};
    const db = getDb();
    return db.collection('users')
    .updateOne({_id:new mongodb.ObjectId(this._id)},{$set:{cart:updatedCart}})
  }

  getCart(){
    const db = getDb();
    console.log("***********************************",this.cart)
    const productsIds = this.cart.items.map(i=>{
      return i.productId;
    });
    console.log(productsIds,"cnegfwefrijwhegchjwhjegfyu")
    return db
    .collection('products')
    .find({_id:{$in:productsIds}})
    .toArray()
    .then(products=>{
      console.log("user get cart model",products)
      return products.map(p=>{
        return {
          ...p,
          quantity:this.cart.items.find(i=>{
            return i.productId.toString()===p._id.toString();
        }).quantity
      };
      });
    });
  }

  deleteItemFromCart(productId){
    const updatedCartItems = this.cart.filter(item=>{
      return item.productId.toString() !== productId.toString()
    });
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",updatedCartItems)
    const db = getDb();
    return db.collection('users')
    .updateOne({_id:new mongodb.ObjectId(this._id)},{$set:{cart:updatedCartItems}})
  }


  addOrder(){
    console.log("order in orders",this.cart);
    const db = getDb();
    return this.getCart()
    .then(products=>{
      const order = {
        items: products,
        user:{
          _id:new mongodb.ObjectId(this._id),
          name:this.name,
        }
      }
      return db.collection('orders')
      .insertOne({...this.cart})
    })
    .then(result=>{
      this.cart = [];
      return db.collection('users')
      .updateOne({_id:new mongodb.ObjectId(this._id)},{$set:{cart:[]}})
    })
  }



  static findById(userId){
    const db = getDb();
    return db.collection('users')
    .findOne({_id:new mongodb.ObjectId(userId)})
    .then(user=>{
      console.log(user);
      return user;
    })
    .catch(err=>{
      console.log(err);
    })
  }
  
}
module.exports = User;
