const express = require('express');
const router = express.Router();
const { testProduceQueue } = require('../controllers/rabbitmqController');

router.get('/', (req, res) => {
    res.send('Hello World!');
});
router.get('/test', testProduceQueue);

module.exports = router