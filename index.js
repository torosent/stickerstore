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

app.get('/load', function (req, res) {
    var x = 0.001;
    var min = 100000;
    var max = 1000000;
    var random = Math.random() * (+max - +min) + +min;

    for (var i = 0; i <= random; i++) {
        x += Math.sqrt(x);
    }
    res.send(x.toString());
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