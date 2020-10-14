import express from 'express';
import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import path from 'path';

import cards from './routes/cards';
import guestbooks from './routes/guestbooks';
import uploads from './routes/uploads';
import Card from './models/card';
import main from './routes/main';
import maps from './routes/maps';
// import mongoose from 'mongoose';

const app = express();

app.set('views', __dirname + '/../public');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
const port = 9898;
const devPort = 3001;
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
  console.log('Connected to mongod server');
})

if(process.env.NODE_ENV == 'development'){
  console.log('Server is reunning on development mode');

  const config = require('../webpack.dev.config');
  let compiler = webpack(config);
  let devServer = new WebpackDevServer(compiler, config.devServer);
  devServer.listen(devPort, () => {
    console.log('webpack-dev-server is listening on port', devPort);
  });
}
if(process.env.NODE_ENV == 'development'){
  mongoose.connect('mongodb://localhost/mpnote');
}else{
  mongoose.connect('mongodb://mpnote:mpnotewhdrms2@localhost/mpnote');
}

app.use('/uploads', uploads);
app.use('/cards', cards);
app.use('/guestbooks', guestbooks);
app.use('/static', express.static(__dirname + '/../public/static'));
app.use('/card', main);
app.use('/admin', express.static(__dirname + '/../public'));
app.use('/admin/maps', maps);
app.use('/admin/maps/*', maps);
app.use('/admin/*', express.static(__dirname + '/../public'));


const server = app.listen(port, () => {
  console.log('Express listening on port', port);
});
