
const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect=(callback)=>{
  MongoClient.connect('mongodb+srv://himanshu08:1WEPR9MY6TgzkSPM@cluster0.l2yrw6k.mongodb.net/?retryWrites=true&w=majority')
  .then(client=>{ 
    console.log("connected");
    _db= client.db();
    callback();
  })
  .catch(err=>{
    console.log(err);
    throw err;
  });
}

const getDb = () =>{
  if(_db){
    return _db;
  }
  throw "No Database Found";
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb
