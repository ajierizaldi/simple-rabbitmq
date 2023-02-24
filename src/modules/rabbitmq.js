const amqp = require('amqplib/callback_api');
const { isEmpty } = require('lodash');


// Init RabbitMQ config
const rabbitmqConfig = {
    url: 'amqp://guest:guest@localhost',
    exchangeName: 'test-exchange',
}

// Init RabbitMQ connection
const rabbitmqConnection = function (main) {
    amqp.connect(rabbitmqConfig.url, function (err, connection) {
        if (err) {
            throw err;
        }
        main(connection);
    });
}

// Producer
const sendToQueue = function (
    connection,
    queueName,
    message,
    exchangeName,
    callback
) {
    return connection.createConfirmChannel(function (err, channel) {
        ch.assertExchange(exchangeName, 'direct');
        const params = {
            message: message
        }
        ch.publish(exchangeName,
            queueName,
            Buffer.from(JSON.stringify({
                request: message,
                params: params
            })));
        return callback();
    });
}

const produceQueue = function (queueName, message, callback) {
    rabbitmqConnection(function (connection) {
        return sendToQueue(
            connection,
            queueName,
            message,
            rabbitmqConfig.exchangeName,
            function () {
                console.log('Message sent to queue');
                return callback(null, 'Processed');
            }
        );
    });
}

// Consumer
const consumeQueue = function (queueName, receiveHandler) {
    let prefetchAmount = 3;
    rabbitmqConnection((connection) => {
        const exname = rabbitmqConfig.exchangeName;
        connection.createChannel((err, channel) => {
            channel.assertExchange(exname, 'direct');
            channel.assertQueue(queueName, { durable: true }, (err, q) => {
                if (err) {
                    console.log("Waiting for queue");
                    throw err;
                }
                channel.bindQueue(q.queue, exname, queueName);
                channel.prefetch(prefetchAmount);
                channel.consume(q.queue, async (msg) => {
                    try {
                        if (isEmpty(msg)) {
                            console.log("Waiting for queue");
                            return;
                        } else {
                            await receiveHandler(channel, msg);
                        }
                    } catch (error) {
                        console.log(error, "Error in consumeQueue");
                    }
                }, {
                    noAck: false
                })
            });
        })
    })
}

module.exports = {
    produceQueue,
    consumeQueue,
    sendToQueue
}
