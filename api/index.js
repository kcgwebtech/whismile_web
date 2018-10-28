const express = require('express');
const app = express();
const port = 8888;

app.use(express.json());
app.use('/auth', require('./auth'));

app.use(express.static('api'));
app.set('view engine', 'jade');
app.set('views', './views');
app.local.pretty = true;

app.get('/test', (req, res) => {
    res.send('hi~');
});

app.listen(port, () => {
    console.log('start server with 8888!');
});
