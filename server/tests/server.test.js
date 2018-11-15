const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');

const test_todos = [
    {
        _id: new ObjectID(),
        text:'First test todo'
    },
    {
        _id: new ObjectID(),
        text:'Second test todo'
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

beforeEach((done)=>{
    Todo.deleteMany({}).then(()=>{
        return Todo.insertMany(test_todos);
    }).then(()=>done());
});

describe('Post /todos',()=>{
    it('should create a new todo', (done)=>{
        const text = 'This is a test string';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text);
            })
            .end((err,res)=>{
                if(err) return done(err);

                Todo.find({text}).then((todos)=>{
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e)=>done(e));
            });
    });

    it('should not create a new todo with invalid data',(done)=>{
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err,res)=>{
                if(err) return done(err);

                Todo.find().then((todos)=>{
                    expect(todos.length).toBe(test_todos.length);
                    done();
                }).catch((e)=>done(e));
            });
    });

});

describe('GET /todos',()=>{
    it('should get all todos',(done)=>{
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res)=>{
                expect(res.body.todos.length).toBe(test_todos.length);
            })
            .end(done);
    });
});

describe('GET /todos/:id',()=>{
    it('should return todo doc',(done)=>{
        request(app)
            .get(`/todos/${test_todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(test_todos[0].text)
            })
            .end(done);
    });

    it('should return 404 if todo not found',(done)=>{

        const id = new ObjectID().toHexString();

        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if wrong objectid',(done)=>{
        request(app)
            .get('/todos/1234abcd')
            .expect(404)
            .end(done);
    });
});