const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
    if(err) return console.log('Unable to connect to MongoDB server')
    console.log('Connected to MongoDB server');

    const db = client.db('TodoApp');

    //deletemany
    /* db.collection('Todos').deleteMany({text:'Eat lunch'}).then(res=>{
        console.log(res);
    }); */

    //deleteone
    /* db.collection('Todos').deleteOne({text:'Eat lunch'}).then(res=>{
        console.log(res);
    }); */

    //findoneanddelete
    /* db.collection('Todos').findOneAndDelete({completed:false}).then(res=>{
        console.log(res);
    }); */

    db.collection('Users').deleteMany({name:'Andrew'}).then(res=>{
        console.log(res);
    });

    db.collection('Users').findOneAndDelete({_id:new ObjectID("5bec57dee4379119006c6a4a")}).then(res=>{
        console.log(JSON.stringify(res,undefined,2));
    });


    //client.close();
});