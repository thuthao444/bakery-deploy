import { expect } from 'chai';
import sinon from 'sinon';
import fs from 'fs'
import {
  addFood,
  listFood,
  removeFood,
  getFoodById,
  addComment,
  searchFood,
  getFoodByName
} from '../controllers/foodController.js';
import foodModel from '../models/foodModel.js';

describe('Food Controller', () => {
  describe('addFood', () => {
    it('should add food item successfully', async () => {
      const req = {
        body: {
          name: 'Test Food',
          description: 'Test description',
          price: 10,
          category: 'Test category'
        },
        file: {
          filename: 'test_image.jpg'
        }
      };
      const res = {
        json: sinon.spy()
      };
      const saveStub = sinon.stub(foodModel.prototype, 'save').resolves();

      await addFood(req, res);

      sinon.assert.calledWith(res.json, { success: true, message: 'Food Added' });
      saveStub.restore();
    });
  });

  describe('listFood', () => {
    it('should return list of food items', async () => {
      const foods = [{ name: 'Food 1' }, { name: 'Food 2' }];
      const req = {};
      const res = {
        json: sinon.spy()
      };
      const findStub = sinon.stub(foodModel, 'find').resolves(foods);

      await listFood(req, res);

      sinon.assert.calledWith(res.json, { success: true, data: foods });
      findStub.restore();
    });

    it('should handle error during food list retrieval', async () => {
      const req = {};
      const res = {
        json: sinon.spy()
      };
      const findStub = sinon.stub(foodModel, 'find').throws(new Error('Test Error'));

      await listFood(req, res);

      sinon.assert.calledWith(res.json, { success: false, message: 'Error' });
      findStub.restore();
    });
  });

  describe('removeFood', () => {
    it('should remove food item successfully', async () => {
      const req = {
        body: {
          id: '123'
        }
      };
      const res = {
        json: sinon.spy()
      };
      const food = {
        image: 'test_image.jpg'
      };
      const findByIdStub = sinon.stub(foodModel, 'findById').resolves(food);
      const deleteStub = sinon.stub(foodModel, 'findByIdAndDelete').resolves();
      const unlinkStub = sinon.stub(fs, 'unlink').callsFake((path, callback) => callback());
  
      await removeFood(req, res);
  
      sinon.assert.calledWith(res.json, { success: true, message: 'Food Removed' });
      sinon.assert.calledWith(unlinkStub, `uploads/${food.image}`);
      
      findByIdStub.restore();
      deleteStub.restore();
      unlinkStub.restore();
    });
  });

  describe('getFoodById', () => {
    it('should return food item for a valid food ID', async () => {
      const req = {
        params: {
          id: 'validFoodId'
        }
      };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };
      const food = {
        _id: 'validFoodId',
        name: 'Test Food',
        description: 'Test Description',
        price: 10.99,
        category: 'Test Category',
        image: 'test_image.jpg'
      };
      const findByIdStub = sinon.stub(foodModel, 'findById').resolves(food);

      await getFoodById(req, res);

      sinon.assert.calledWith(res.json, { success: true, data: food });

      findByIdStub.restore();
    });

    it('should handle error for invalid food ID', async () => {
      const req = {
        params: {
          id: 'invalidFoodId'
        }
      };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };
      const error = new Error('Food not found');
      const findByIdStub = sinon.stub(foodModel, 'findById').rejects(error);

      await getFoodById(req, res);

      sinon.assert.calledWith(res.status, 500);
      sinon.assert.calledWith(res.json, { message: 'Error' });

      findByIdStub.restore();
    });
  });

  describe('addComment', () => {
    it('should add comment to food item successfully', async () => {
      const req = {
        params: {
          id: 'validFoodId'
        },
        body: {
          userId: 'validUserId',
          comment: 'Test Comment',
          rating: 5
        }
      };
      const res = {
        json: sinon.spy()
      };
      const food = {
        _id: 'validFoodId',
        ratings: []
      };
      const findByIdStub = sinon.stub(foodModel, 'findById').resolves(food);
      const saveStub = sinon.stub(foodModel.prototype, 'save').resolves();

      await addComment(req, res);

      sinon.assert.calledWith(res.json, { success: true, message: 'Added comment' });

      findByIdStub.restore();
      saveStub.restore();
    });
  });

  describe('searchFood', () => {
    it('should return list of food items based on search query', async () => {
        const req = {
            query: { search: 'pizza' }
        };
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };
        const expectedFoods = [{ name: 'Pizza Margherita' }, { name: 'Pepperoni Pizza' }];
        sinon.stub(foodModel, 'find').resolves(expectedFoods);

        await searchFood(req, res);

        expect(res.json.calledOnce).to.be.true;
        expect(res.json.calledWithExactly({ success: true, message: 'Searched', data: expectedFoods })).to.be.true;
        expect(res.status.called).to.be.false;

        foodModel.find.restore();
    });

    it('should handle error and return 500 status', async () => {
        const req = {
            query: { search: 'pizza' }
        };
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };
        sinon.stub(foodModel, 'find').throws(new Error('Test Error'));

        await searchFood(req, res);

        expect(res.json.called).to.be.false;
        expect(res.status.calledOnceWith(500)).to.be.true;

        foodModel.find.restore();
    });
});

    describe('getFoodByName', () => {
        it('should return food item by name', async () => {
            const req = {
                query: { name: 'Pizza Margherita' }
            };
            const res = {
                json: sinon.spy(),
                status: sinon.stub().returnsThis()
            };
            const expectedFood = { name: 'Pizza Margherita' };
            sinon.stub(foodModel, 'findOne').resolves(expectedFood);

            await getFoodByName(req, res);

            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWithExactly({ success: true, message: 'Get food by name successful.', data: expectedFood })).to.be.true;
            expect(res.status.called).to.be.false;

            foodModel.findOne.restore();
        });

        it('should handle not found scenario and return 404 status', async () => {
            const req = {
                query: { name: 'Nonexistent Food' }
            };
            const res = {
                json: sinon.spy(),
                status: sinon.stub().returnsThis()
            };
            sinon.stub(foodModel, 'findOne').resolves(null);

            await getFoodByName(req, res);

            expect(res.json.calledOnceWithExactly({ success: false, message: 'Food not found' })).to.be.true;
            expect(res.status.calledOnceWith(404)).to.be.true;

            foodModel.findOne.restore();
        });

        it('should handle error and return 500 status', async () => {
            const req = {
                query: { name: 'Pizza Margherita' }
            };
            const res = {
                json: sinon.spy(),
                status: sinon.stub().returnsThis()
            };
            sinon.stub(foodModel, 'findOne').throws(new Error('Test Error'));

            await getFoodByName(req, res);

            expect(res.json.called).to.be.false;
            expect(res.status.calledOnceWith(500)).to.be.true;

            foodModel.findOne.restore();
        });
    });
});
