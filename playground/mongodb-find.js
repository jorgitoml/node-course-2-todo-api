//const MongoClient = require('mongodb').MongoClient;

const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
    if(err) return console.log('Unable to connect to MongoDB server')
    console.log('Connected to MongoDB server');

    const db = client.db('TodoApp');

    /* db.collection('Todos').find().toArray().then(docs=>{
        console.log('Todos');
        console.log(JSON.stringify(docs,undefined,2));
    }),err=>{
      console.log('Unable to fetch todos',err);  
    }; */

    /* db.collection('Todos').find({completed:false}).toArray().then(docs=>{
        console.log('Uncompleted Todos');
        console.log(JSON.stringify(docs,undefined,2));
    }),err=>{
      console.log('Unable to fetch todos',err);  
    }; */

    /* db.collection('Todos').find({_id:new ObjectID('5bec5d2adc4ed96a17b9b5b6')}).toArray().then(docs=>{
        console.log('Find by ID Todo');
        console.log(JSON.stringify(docs,undefined,2));
    }),err=>{
      console.log('Unable to fetch todos',err);  
    }; */

    db.collection('Todos').find().count().then(count=>{
        console.log(`Todos count: ${count}`);
    }),err=>{
      console.log('Unable to fetch todos',err);  
    };

    db.collection('Users').find({name:'Diana'}).toArray().then(docs=>{
        console.log('Dianas');
        console.log(JSON.stringify(docs,undefined,2));
    }),err=>{
      console.log('Unable to fetch Users',err);  
    };

    //client.close();
});