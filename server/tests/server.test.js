const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');
const {User} = require('../models/user');

const {test_todos,populateTodos,test_users,populateUsers} = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);


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

describe('DELETE /todos/:id',()=>{
    it('should remove a todo',(done)=>{
        request(app)
            .delete(`/todos/${test_todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo._id).toBe(test_todos[0]._id.toHexString());
            })
            .end((err,res)=>{
                if(err) return done(err);

                Todo.findById(test_todos[0]._id.toHexString()).then((todo)=>{
                    expect(todo).toBeFalsy();
                    done();
                }).catch((e)=>done(e));
            });
    });

    it('should return 404 if todo not found',(done)=>{
        const id = new ObjectID().toHexString();

        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if wrong objectid',(done)=>{
        request(app)
            .delete('/todos/1234abcd')
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id',()=>{
    it('should update a todo',(done)=>{
        const hexId = test_todos[0]._id.toHexString();
        const newText = 'This is a NEW test string';

        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: true,
                text: newText
            })
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(newText);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof  res.body.todo.completedAt).toBe('number');
            })
            .end(done);

    });

    it('should clear completedat when todo is not completed',(done)=>{
        const hexId = test_todos[1]._id.toHexString();
        const newText = 'This is a NEW test string';

        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: false,
                text: newText
            })
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(newText);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBeFalsy();
            })
            .end(done);
    });

    it('should return 404 if todo not found',(done)=>{
        const id = new ObjectID().toHexString();

        request(app)
            .patch(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if wrong objectid',(done)=>{
        request(app)
            .patch('/todos/1234abcd')
            .expect(404)
            .end(done);
    });
});

describe('GET /users/me',()=>{
    it('should return user if autenticated',(done)=>{
        request(app)
            .get('/users/me')
            .set('x-auth',test_users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body._id).toBe(test_users[0]._id.toHexString());
                expect(res.body.email).toBe(test_users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not autenticated',(done)=>{
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res)=>{
                expect(res.body).toEqual({});
            })
            .end(done);    
    });
});

describe('POST /users',()=>{
    it('should create a user',(done)=>{
        const email = 'test@test.com';
        const password = '123456';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res)=>{
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            .end((err)=>{
                if(err) done(err);
                
                User.findOne({email}).then((user)=>{
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password);
                    done();
                }).catch((e)=>done(e));
            });

    });

    it('should return validation errors if request invalid',(done)=>{
        const email = 'test.com';
        const password = '1';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });

    it('should not create user if email in use',(done)=>{
        const email = test_users[0].email;
        const password = test_users[0].password;
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });
   
});

describe('POST /users/login',()=>{
    it('should login user and return auth token',(done)=>{
        const email = test_users[1].email;
        const password = test_users[1].password;

        request(app)
            .post('/users/login')
            .send({email, password})
            .expect(200)
            .expect((res)=>{
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err,res)=>{
                if(err) return done(err);

                User.findById(test_users[1]._id).then((user)=>{
                    expect(user.tokens[0]).toMatchObject(
                        {
                            access: 'auth',
                            token: res.headers['x-auth']
                        }
                    );
                    done();
                }).catch((e)=>done(e));
            });
    });

    it('should reject invalid login',(done)=>{
        const email = test_users[1].email;
        const password = 'invalid_pass';

        request(app)
            .post('/users/login')
            .send({email, password})
            .expect(400)
            .expect((res)=>{
                expect(res.headers['x-auth']).toBeFalsy();
            })
            .end((err,res)=>{
                if(err) return done(err);

                User.findById(test_users[1]._id).then((user)=>{
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e)=>done(e));
            });
    });
});

describe('DELETE /users/me/token',()=>{
    it('should remove auth token on logout',(done)=>{
        request(app)
           .delete('/users/me/token')
           .set('x-auth',test_users[0].tokens[0].token) 
           .expect(200)
           .end((err,res)=>{
                if(err) return done(err);

                User.findById(test_users[0]._id).then((user)=>{
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e)=>done(e));
           });
    })
});