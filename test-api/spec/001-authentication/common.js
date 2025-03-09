let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

const basePaths = [
  '/api/v1/announcements',
  '/api/v1/api-keys',
  '/api/v1/content-slots',
  '/api/v1/displays',
  '/api/v1/incidents',
  '/api/v1/locations',
  '/api/v1/settings',
  '/api/v1/views',
]

describe('Authentication', function () {
  for (const basePath of basePaths) {
    describe(basePath, function () {
      it(`GET ${basePath} should require authentication`, function (done) {
        chai.request(this.server.base)
          .get(basePath)
          .end((err, res) => {
            if (err) {
              return done(err)
            }
            res.should.have.status(401);
            done();
          });
      });

      it(`GET ${basePath} should reject invalid JWT`, function (done) {
        chai.request(this.server.base)
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

      it(`POST ${basePath} should require authentication`, function (done) {
        chai.request(this.server.base)
          .post(basePath)
          .send({})
          .end((err, res) => {
            if (err) {
              return done(err)
            }
            res.should.have.status(401);
            done();
          });
      });

      it(`POST ${basePath} should reject invalid JWT`, function (done) {
        chai.request(this.server.base)
          .post(basePath)
          .auth('invalid-token', { type: 'bearer' })
          .send({})
          .end((err, res) => {
            if (err) {
              return done(err)
            }
            res.should.have.status(401);
            done();
          });
      });

      it(`GET ${basePath}/:id should require authentication`, function (done) {
        chai.request(this.server.base)
          .get(`${basePath}/1`)
          .end((err, res) => {
            if (err) {
              return done(err)
            }
            res.should.have.status(401);
            done();
          });
      });

      it(`GET ${basePath}/:id should reject invalid JWT`, function (done) {
        chai.request(this.server.base)
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

      it(`PUT ${basePath}/:id should require authentication`, function (done) {
        chai.request(this.server.base)
          .put(`${basePath}/1`)
          .send({})
          .end((err, res) => {
            if (err) {
              return done(err)
            }
            res.should.have.status(401);
            done();
          });
      });

      it(`PUT ${basePath}/:id should reject invalid JWT`, function (done) {
        chai.request(this.server.base)
          .put(`${basePath}/1`)
          .auth('invalid-token', { type: 'bearer' })
          .send({})
          .end((err, res) => {
            if (err) {
              return done(err)
            }
            res.should.have.status(401);
            done();
          });
      });

      it(`PATCH ${basePath}/:id should require authentication`, function (done) {
        chai.request(this.server.base)
          .patch(`${basePath}/1`)
          .send({})
          .end((err, res) => {
            if (err) {
              return done(err)
            }
            res.should.have.status(401);
            done();
          });
      });

      it(`PATCH ${basePath}/:id should reject invalid JWT`, function (done) {
        chai.request(this.server.base)
          .patch(`${basePath}/1`)
          .auth('invalid-token', { type: 'bearer' })
          .send({})
          .end((err, res) => {
            if (err) {
              return done(err)
            }
            res.should.have.status(401);
            done();
          });
      });

      it(`DELETE ${basePath}/:id should require authentication`, function (done) {
        chai.request(this.server.base)
          .delete(`${basePath}/1`)
          .end((err, res) => {
            if (err) {
              return done(err)
            }
            res.should.have.status(401);
            done();
          });
      });

      it(`DELETE ${basePath}/:id should reject invalid JWT`, function (done) {
        chai.request(this.server.base)
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
  }
});
