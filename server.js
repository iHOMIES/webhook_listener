'use strict';

// Require express and body-parser
const express = require("express")
const bodyParser = require("body-parser")

// Initialize express and define a port
const app = express()
const PORT = 3000
const HOST = '0.0.0.0';

app.use(bodyParser.json())

// Start express on the defined port
app.listen(PORT, HOST);
console.log(`🚀 Running on http://${HOST}:${PORT}`);

process.on('SIGINT', function() {
    console.log("Caught interrupt signal");

    if (i_should_exit)
        process.exit();
});
