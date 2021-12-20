const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('express-flash');
const whatsappController = require('./whatsapp/whatsappController');
const configuracaoController = require('./configuracao/configuracaoController');


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 30000}
}));
app.use(flash());

app.get('/', (req, res) => {
    res.render('index');
});
app.use('/', whatsappController);
app.use('/', configuracaoController);

app.listen(3000, () => {
    console.log('Servidor Ativo');
});