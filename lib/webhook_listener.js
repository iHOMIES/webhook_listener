"use strict";

const GitHub = require("./github_helper.js"),
      config = require("./config.js"),
      express = require("express"),
      bodyParser = require("body-parser"),
      timestamp = require("log-timestamp"),
      http = require("http"),
      https = require("https"),
      fs = require("fs");

var privateKey;
var certificate;

if (config.WEBHOOK_SSL_KEY_PATH != ""){
    privateKey = fs.readFileSync(config.WEBHOOK_SSL_KEY_PATH).toString();
    console.log("Reading ssl key", config.WEBHOOK_SSL_KEY_PATH);
} else{
    privateKey = config.WEBHOOK_SSL_KEY;
}
if (config.WEBHOOK_SSL_CERT_PATH != ""){
    certificate = fs.readFileSync(config.WEBHOOK_SSL_CERT_PATH).toString();
    console.log("Reading ssl cert", config.WEBHOOK_SSL_CERT_PATH);
} else {
    certificate = config.WEBHOOK_SSL_CERT;
}
var credentials = {key: privateKey, cert: certificate};

const webhook = express();

webhook.use(bodyParser.json());

webhook.post("/", GitHub.verifyPostData, function (req, res) {
    res.status(200).send("Webhook delivered successfully");
    console.log("Response 200 OK");
});

webhook.use((err, req, res, next) => {
    if (err) console.error(err);
    res.status(403).send("Error creating branch protection, please chech log for details");
    console.log("Error creating branch protection.");
});

module.exports = {
    start: function() {
        if (credentials.key == "" && credentials.cert == "") {
            var httpServer = http.createServer(webhook);
            httpServer.listen(config.WEBHOOK_PORT, config.WEBHOOK_HOST);
            console.log(`🚀 Running on http://${config.WEBHOOK_HOST}:${config.WEBHOOK_PORT}`);
        }
        else {
            var httpsServer = https.createServer(credentials, webhook);
            httpsServer.listen(config.WEBHOOK_PORT, config.WEBHOOK_HOST);
            console.log(`🚀 Running on https://${config.WEBHOOK_HOST}:${config.WEBHOOK_PORT}`);
        }
    }
};
