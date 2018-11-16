const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');

const user1Id = new ObjectID();
const user2Id = new ObjectID();

const test_users = [
    {
        _id:  user1Id,
        email: 'dropu@lalala.com',
        password: 'user1Pass',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({_id: user1Id, access: 'auth'}, 'abc123').toString()
            }
        ]
    },
    {
        _id:  user2Id,
        email: 'ronro@lalala.com',
        password: 'user2Pass'
    }
];

const test_todos = [
    {
        _id: new ObjectID(),
        text:'First test todo'
    },
    {
        _id: new ObjectID(),
        text:'Second test todo',
        completed: true,
        completedAt: 333
    },
    {
        _id: new ObjectID(),
        text:'Third test todo'
    },
    {
        _id: new ObjectID(),
        text:'Fourth test todo'
    }
];

const populateTodos = (done)=>{
    Todo.deleteMany({}).then(()=>{
        return Todo.insertMany(test_todos);
    }).then(()=>done());
};


const populateUsers = (done)=>{
    User.deleteMany({}).then(()=>{
        const user1 = new User(test_users[0]).save();
        const user2 = new User(test_users[1]).save();

        return Promise.all([user1,user2]);
    })
    .then(()=>done());
};

module.exports = {test_todos,populateTodos,test_users,populateUsers};