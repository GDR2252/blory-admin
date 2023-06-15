const express = require('express');
const path = require('path');
const logger = require('log4js').getLogger(path.parse(__filename).name);
const { fetchThemesData } = require('../dao/fetchnavdata');

const router = express.Router();

// eslint-disable-next-line no-unused-vars
router.get('/', async (req, res, next) => {
  logger.info('Fetching Data for Themes.');
  const data = await fetchThemesData();
  logger.info('Data fetched for Themes.');
  res.json(data);
});

module.exports = router;
