let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let server = require('./server')

chai.use(chaiHttp);

const basePath = '/users'
describe(basePath, () => {
  describe('Authentication', () => {
    it(`GET ${basePath} should require authentication`, (done) => {
      chai.request(server.base)
        .get(basePath)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          res.should.have.status(401);
          done();
        });
    });

    it(`GET ${basePath} should reject invalid JWT`, (done) => {
      chai.request(server.base)
        .get(basePath)
        .auth('invalid-token', { type: 'bearer' })
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          res.should.have.status(401);
          done();
        });
    });

    it(`POST ${basePath} should require authentication`, (done) => {
      chai.request(server.base)
        .post(basePath)
        .send({password: 'secret'})
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          res.should.have.status(401);
          done();
        });
    });

    it(`POST ${basePath} should reject invalid JWT`, (done) => {
      chai.request(server.base)
        .post(basePath)
        .auth('invalid-token', { type: 'bearer' })
        .send({password: 'secret'})
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          res.should.have.status(401);
          done();
        });
    });

    it(`GET ${basePath}/:id should require authentication`, (done) => {
      chai.request(server.base)
        .get(`${basePath}/1`)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          res.should.have.status(401);
          done();
        });
    });

    it(`GET ${basePath}/:id should reject invalid JWT`, (done) => {
      chai.request(server.base)
        .get(`${basePath}/1`)
        .auth('invalid-token', { type: 'bearer' })
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          res.should.have.status(401);
          done();
        });
    });

    it(`PUT ${basePath}/:id should require authentication`, (done) => {
      chai.request(server.base)
        .put(`${basePath}/1`)
        .send({password: 'another secret'})
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          res.should.have.status(401);
          done();
        });
    });

    it(`PUT ${basePath}/:id should reject invalid JWT`, (done) => {
      chai.request(server.base)
        .put(`${basePath}/1`)
        .auth('invalid-token', { type: 'bearer' })
        .send({password: 'another secret'})
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          res.should.have.status(401);
          done();
        });
    });

    it(`PATCH ${basePath}/:id should require authentication`, (done) => {
      chai.request(server.base)
        .patch(`${basePath}/1`)
        .send({password: 'another secret'})
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          res.should.have.status(401);
          done();
        });
    });

    it(`PATCH ${basePath}/:id should reject invalid JWT`, (done) => {
      chai.request(server.base)
        .patch(`${basePath}/1`)
        .auth('invalid-token', { type: 'bearer' })
        .send({password: 'another secret'})
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          res.should.have.status(401);
          done();
        });
    });

    it(`DELETE ${basePath}/:id should require authentication`, (done) => {
      chai.request(server.base)
        .delete(`${basePath}/1`)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          res.should.have.status(401);
          done();
        });
    });

    it(`DELETE ${basePath}/:id should reject invalid JWT`, (done) => {
      chai.request(server.base)
        .delete(`${basePath}/1`)
        .auth('invalid-token', { type: 'bearer' })
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          res.should.have.status(401);
          done();
        });
    });
  });
});
