const expect = require('expect');
const request = require('supertest');

const {app} = require('../server');
const {Todo} = require('../models/todo');

const test_todos = [
    {text:'First test todo'},
    {text:'Second test todo'},
    {text:'Third test todo'},
    {text:'Fourth test todo'}
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