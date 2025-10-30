const express = require('express');
const conn = require('./db/conn');
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')

const app = express();
app.use(express.json());
require('dotenv').config();

app.use(cors())
app.use(express.urlencoded({ extended: false }));

const login_rt = require('./routes/rt_login');
const parceiro_rt = require('./routes/rt_parceiro')
const generico_rt = require('./routes/rt_generico')
const item_rt = require('./routes/rt_item')
const servico_rt = require('./routes/rt_servico')

app.use('/login', login_rt);
app.use('/parceiro', parceiro_rt);
app.use('/generico', generico_rt);
app.use('/item', item_rt);
app.use('/servico', servico_rt);

app.listen(3042, () => {
    console.log('Server is running on http://localhost:3042');
});
  