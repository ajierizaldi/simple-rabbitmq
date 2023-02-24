const { get } = require('lodash'),
    produceQueue = require('../modules/rabbitmq');

module.exports = {
    testProduceQueue: async (req, res) => {
        try {
            const message = {
                data: 'Yeay berhasil!!'
            }
            produceQueue(message, 'testProduceQueue', (err, result) => {
                if (err) {
                    return res.status(400).json({
                        message: err
                    })
                }
                return res.status(200).json({
                    message: result
                })
            });
        } catch (error) {
            console.log(error, "Error in testProduceQueue");
        }
    },
    counsumerRabbitmq: (channel, msg) => {
        console.log('Success consume queue')
        const message = JSON.parse(msg.content.toString());
        const rabbitmqMessage = get(message, 'params.message');

        console.log('Rabbitmq message: ', rabbitmqMessage);
        channel.ack(msg);
    }
}