import express from 'express';
import Card from '../models/card';
import * as mongoosePagination from 'mongoose-pagination'
import moment from 'moment';
import mongoose from 'mongoose';

const router = express.Router();
var client_id = 'P5zQEA8giiDgTNi8AQxP';
var client_secret = '_IQlI0vItx';


router.get('/', function(req, res){
  res.render('maps');
});
router.get('/search/:query', function(req, res){
  var query = req.params.query;
  var api_url = 'https://openapi.naver.com/v1/search/local.json?query='+query;
  var request = require('request');

   var options = {
       url: api_url,
      //  form: {'query':query},
       headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
    };
   request.get(options, function (error, response, body) {
     if (!error && response.statusCode == 200) {
       res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
       res.end(body);
     } else {
       res.status(response.statusCode).end();
       console.log('error = ' + response.statusCode);
     }
   });
});

export default router;
