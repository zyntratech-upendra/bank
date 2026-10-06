const express = require('express');
const router = express.Router();
const Store = require('../data/store');

router.get('/services', async (req, res) => {
  try {
    const settings = await Store.getSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Error loading services', error: err.message });
  }
});

router.get('/locations', async (req, res) => {
  try {
    const locations = await Store.getLocations();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: 'Error loading locations', error: err.message });
  }
});

router.get('/bank-rates', async (req, res) => {
  try {
    const rates = await Store.getAllBankRates();
    res.json(rates);
  } catch (err) {
    res.status(500).json({ message: 'Error loading bank rates', error: err.message });
  }
});

router.get('/dynamic-services', async (req, res) => {
  try {
    const services = await Store.getAllServices();
    res.json(services.filter(s => s.status === 'Active'));
  } catch (err) {
    res.status(500).json({ message: 'Error loading dynamic services', error: err.message });
  }
});

router.post('/service-requests', async (req, res) => {
  try {
    const request = await Store.createServiceRequest(req.body);
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: 'Error submitting request', error: err.message });
  }
});

module.exports = router;
