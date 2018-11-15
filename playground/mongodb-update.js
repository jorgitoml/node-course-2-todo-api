const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
    if(err) return console.log('Unable to connect to MongoDB server')
    console.log('Connected to MongoDB server');

    const db = client.db('TodoApp');

    /* db.collection('Todos').findOneAndUpdate(
        {
            _id:new ObjectID("5bec57dee4379119006c6a4a")
        },
        {
            $set: {
                completed: true
            }
        },
        {
            returnOriginal: false
        }).then(res=>{
            console.log(res);
    }); */

    db.collection('Users').findOneAndUpdate(
        {
            _id:new ObjectID("5bec57dee4379119006c6a4a")
        },
        {
            $set: {
                name: 'Dropu'
            },
            $inc: {
                age:1
            }
        },
        {
            returnOriginal: false
        }).then(res=>{
            console.log(res);
    });


    //client.close();
});