'use strict';

const GitHub = require('./github_helper.js'),
      config = require('./config.js'),
      express = require('express'),
      bodyParser = require('body-parser')

const webhook = express();

webhook.use(bodyParser.json())

webhook.post('/', GitHub.verifyPostData, function (req, res) {
    res.status(200).send('Webhook delivered successfully.')
    console.log('Response 200 OK');
})

webhook.use((err, req, res, next) => {
    if (err) console.error(err)
    res.status(403).send('Error creating branch protection, please chech log for details.')
    console.log('Error creating branch protection.');
})

module.exports = {
    start: function() {
        webhook.listen(config.WEBHOOK_PORT, config.WEBHOOK_HOST)
        console.log(`🚀 Running on http://${config.WEBHOOK_HOST}:${config.WEBHOOK_PORT}`);
    }
  };
