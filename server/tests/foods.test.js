const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const foodRoutes = require('../routes/foodRoutes');

// Mocking the Food model for unit testing
jest.mock('../models/Food');
const Food = require('../models/Food');

const app = express();
app.use(express.json());
app.use('/api/menu', foodRoutes);

describe('Food API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/menu', () => {
    it('should fetch all available food items', async () => {
      const mockFoods = [
        { name: 'Pizza', price: 15, isAvailable: true },
        { name: 'Burger', price: 10, isAvailable: true }
      ];
      Food.find.mockResolvedValue(mockFoods);

      const res = await request(app).get('/api/menu');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(2);
      expect(res.body[0].name).toEqual('Pizza');
    });
  });

  describe('GET /api/menu/:id', () => {
    it('should return 404 if food item does not exist', async () => {
      Food.findById.mockResolvedValue(null);

      const res = await request(app).get('/api/menu/nonexistent_id');
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toContain('not found');
    });
  });

  describe('POST /api/menu', () => {
    it('should fail if unauthorized (missing token)', async () => {
      const res = await request(app)
        .post('/api/menu')
        .send({ name: 'Steak', price: 30 });
      
      expect(res.statusCode).toEqual(401);
    });
  });
});
