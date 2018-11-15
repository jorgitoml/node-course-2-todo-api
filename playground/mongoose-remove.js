const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');


Todo.remove({}).then((result)=>{
    console.log(result);
});

Todo.findOneAndRemove({_id:'5bed70469a81392a50cdf06d'}).then((todo)=>{
    console.log(todo);
});

Todo.findByIdAndRemove('5bed70469a81392a50cdf06d').then((todo)=>{
    console.log(todo);
});