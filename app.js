const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const errorController = require('./controllers/error');

// const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   User.findById('64a93a8cf4b710d36139fdf1')
//     .then(user => {
//       req.user = new User(user.name,user.email,user.cart,user._id);
//       next();
//     })
//     .catch(err => console.log(err));
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://himanshu08:1WEPR9MY6TgzkSPM@cluster0.l2yrw6k.mongodb.net/shop?retryWrites=true&w=majority')
.then(result=>{
  console.log("connected")
  app.listen(3000);
})
.catch(err=>{
  console.log(err);
})