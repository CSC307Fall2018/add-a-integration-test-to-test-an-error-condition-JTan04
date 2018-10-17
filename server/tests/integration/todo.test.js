const request = require('supertest');
const app = require('../../app');
const truncate = require('../truncate');
const { ToDo } = require('../../models');

const failPath = '/FAIL';
const rootPath = '/todos';

describe('/todos', () => {

  beforeEach(() => {
    return truncate();
  });

  afterAll(() => {
    return ToDo.sequelize.close();
  });

  describe('GET /', () => {
    it('should return an empty array', () => {
      return request(app)
        .get(rootPath)
        .expect((response) => {
          return expect(response.body.todos).toEqual([]);
        });
    });
    it('error', () => {
      return request(app).get(failPath).expect(404);
    });

    it('should return 1 item in the array', () => {
      return ToDo.create({
        subject: 'test',
      }).then(() => {
        return request(app).get(rootPath).expect((response) => {
          return expect(response.body.todos.length).toEqual(1);
        });
      });
    });
  });

  describe('POST /', () => {
    it('should create one todo item', () => {
      return request(app)
        .post(rootPath)
        .send({
          subject: 'test',
        })
        .expect(200)
        .then((response) => {
          return expect(response.body.subject).toEqual('test');
        });
    });
  });

  describe('DELETE /', () => {
    it('should delete one todo', () => {
      return ToDo.create({
        subject: 'test',
      }).then((item) => {
        return request(app).delete(rootPath + '/' + item.id).expect((response) => {
          return expect(response.body.delete).toEqual(true);
        });
      });
    });
  });


});
