const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');


const id = '5bed70469a81392a50cdf06d';

if(!ObjectID.isValid(id)) console.log('Invalid ID');

Todo.find({
    _id: id
}).then((todos)=>{
    console.log('Todos',todos);
});

Todo.findOne({
    _id: id
}).then((todo)=>{
    console.log('Todo',todo);
});

Todo.findById(id).then((todo)=>{
    if(!todo) return console.log('Id not found');
    console.log('Todo by ID',todo);
}).catch((e)=>console.log(e));




const user_id = '5bed70469a81392a50cdf06d';

User.findById(user_id).then((user)=>{
    if(!user) return console.log('User not found');
    console.log(JSON.stringify(user),undefined,2);
}).catch((e)=>console.log(e));