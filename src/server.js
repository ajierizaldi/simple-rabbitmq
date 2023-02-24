require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');


const port = process.env.PORT || 3000;

const routes = require('./routes');
const { consumeQueue } = require('./modules/rabbitmq');
const { counsumerRabbitmq } = require('./controllers/rabbitmqController');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(routes)

consumeQueue('testProduceQueue', counsumerRabbitmq);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});