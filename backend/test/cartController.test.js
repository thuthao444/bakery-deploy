import { expect } from 'chai';
import userModel from '../models/userModel.js';
import { addToCart, removeFromCart, getCart } from '../controllers/cartController.js';

describe('Cart Controller', () => {
    describe('addToCart', () => {
        it('should add items to user cart successfully', async () => {
            const req = {
                body: {
                    userId: 'mockUserId',
                    itemId: 'mockItemId'
                }
            };
            const res = {
                json: function(data) {
                    expect(data.success).to.be.true;
                    expect(data.message).to.equal('Added to cart');
                }
            };

            userModel.findById = async () => ({
                _id: 'mockUserId',
                cartData: {},
                save: async () => {}
            });

            await addToCart(req, res);
        });

        // Add more tests to cover edge cases and error handling scenarios
    });

    describe('removeFromCart', () => {
        it('should remove items from user cart successfully', async () => {
            const req = {
                body: {
                    userId: 'mockUserId',
                    itemId: 'mockItemId'
                }
            };
            const res = {
                json: function(data) {
                    expect(data.success).to.be.true;
                    expect(data.message).to.equal('Remove from cart');
                }
            };

            userModel.findById = async () => ({
                _id: 'mockUserId',
                cartData: { 'mockItemId': 1 },
                save: async () => {}
            });

            await removeFromCart(req, res);
        });

        // Add more tests to cover edge cases and error handling scenarios
    });

    describe('getCart', () => {
        it('should fetch user cart data successfully', async () => {
            const req = {
                body: {
                    userId: 'mockUserId'
                }
            };
            const res = {
                json: function(data) {
                    expect(data.success).to.be.true;
                    expect(data).to.have.property('cartData').to.be.an('object');
                }
            };

            userModel.findById = async () => ({
                _id: 'mockUserId',
                cartData: {},
            });

            await getCart(req, res);
        });
    });
});
