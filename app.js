const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const errorController = require('./controllers/error');

const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('64aa948088fcb015c1931479')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://himanshu08:1WEPR9MY6TgzkSPM@cluster0.l2yrw6k.mongodb.net/shop?retryWrites=true&w=majority')
.then(result=>{
  User.findOne()
  .then(user=>{
    if(!user){
      const user = new User({
        name:"Himanshu",
        email:"himanshu@gmail.com",
        cart:{
          items:[]
        }
      });
      user.save();
    }
  })
  
  console.log("connected");
  app.listen(3000);
})
.catch(err=>{
  console.log(err);
})