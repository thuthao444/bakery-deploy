import { expect } from 'chai';
import { loginUser, registerUser, getUser, changeUser } from '../controllers/userController.js';
import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

describe('User Controller', () => {
  describe('loginUser', () => {
    it('should return success with valid credentials', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123'
        }
      };
      const res = {
        json: function (data) {
          expect(data.success).to.be.true;
          expect(data).to.have.property('token');
          expect(data).to.have.property('name');
        }
      };

      const mockUser = {
        _id: 'mockUserId',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword'
      };

      userModel.findOne = async () => mockUser;
      bcrypt.compare = async () => true;
      jwt.sign = () => 'mockToken';

      await loginUser(req, res);
    });
  });
  describe('registerUser', () => {
    it('should successfully register a new user', async () => {
      const req = {
        body: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        }
      };
      const res = {
        json: function (data) {
          expect(data.success).to.be.true;
          expect(data).to.have.property('token');
        }
      };

      userModel.findOne = async () => null;
      bcrypt.genSalt = async () => 'mockSalt';
      bcrypt.hash = async () => 'hashedPassword';
      userModel.prototype.save = async () => ({
        _id: 'mockUserId'
      });
      jwt.sign = () => 'mockToken';

      await registerUser(req, res);
    });

    it('should fail if email already exists', async () => {
      const req = {
        body: {
          name: 'Test User',
          email: 'existing@example.com',
          password: 'password123'
        }
      };
      const res = {
        json: function (data) {
          expect(data.success).to.be.false;
          expect(data.message).to.equal('User already exists');
        }
      };

      userModel.findOne = async () => ({});

      await registerUser(req, res);
    });

  });

  describe('getUser', () => {
    it('should return user data for a valid user ID', async () => {
      const req = {
        body: {
          userId: 'validUserId'
        }
      };
      const res = {
        json: function (data) {
          expect(data.success).to.be.true;
          expect(data).to.have.property('data');
        }
      };

      userModel.findById = async () => ({
        _id: 'validUserId',
        name: 'Test User',
        email: 'test@example.com'
      });

      await getUser(req, res);
    });

    it('should return error for invalid user ID', async () => {
      const req = {
        body: {
          userId: 'invalidUserId'
        }
      };
      const res = {
        json: function (data) {
          expect(data.success).to.be.false;
          expect(data.message).to.equal('Error');
        }
      };

      userModel.findById = async () => {
        throw new Error('Error');
      };

      await getUser(req, res);
    });

  });
  describe('changeUser', () => {
    it('should successfully change user information', async () => {
      const req = {
        body: {
          userId: 'validUserId',
          email: 'newemail@example.com',
          name: 'New Name',
          sex: 'male',
          birthday: new Date(),
          phone: '123456789',
          address: 'New Address'
        }
      };
      const res = {
        status: function (status) {
          expect(status).to.equal(200);
          return this;
        },
        json: function (data) {
          expect(data.success).to.be.true;
          expect(data.message).to.equal('Success to change information');
        }
      };
  
      userModel.findById = async () => ({
        _id: 'validUserId',
        save: async () => {}
      });
  
      await changeUser(req, res);
    });
  
    it('should return error if user ID not found', async () => {
      const req = {
        body: {
          userId: 'invalidUserId'
        }
      };
      const res = {
        status: function (status) {
          expect(status).to.equal(404);
          return this;
        },
        json: function (data) {
          expect(data.success).to.be.false;
          expect(data.message).to.equal('User not found');
        }
      };
  
      userModel.findById = async () => null;
  
      await changeUser(req, res);
    });
  });
  
});
