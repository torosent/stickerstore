var express = require('express');
var app = express();
var path = require('path');
var request = require('request');
var bodyparser = require('body-parser');

app.use(bodyparser.urlencoded({
    extended: true
}));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/healthz', function (req, res) {
    res.send("i am alive!!!");
});

app.post('/order', function (req, res) {
    let address = process.env.ORDER_SERVICE;
    request.post(address, {
        form: {
            value: req.body.value,
            count: req.body.count
        }
    })
})

app.listen(3000);