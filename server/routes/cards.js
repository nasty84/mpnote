import express from 'express';
import Card from '../models/card';
import * as mongoosePagination from 'mongoose-pagination'
import mongoose from 'mongoose';
import fs from 'fs';
import Path from 'path';

const router = express.Router();

router.get('/', (req, res) => {
  let page = req.query.page ? parseInt(req.query.page) : 1;
  let pageSize = req.query.size ? parseInt(req.query.size) : 10;

  Card.find()
    .sort({regDttm:-1})
    .paginate(page, pageSize, function(err, cards, total){
      if(err) return res.status(500).send({error: 'database failure'});
      if(!cards) return res.status(404).json({error:'cards not found'});
      let pageObj = {
        totalCount : total,
        totalPage : Math.ceil(total/pageSize),
        nowPage : page
      };
      res.json({
        cards: cards,
        page: pageObj
      });
  });
});

router.get('/:card_id', function(req, res){
  if(mongoose.Types.ObjectId.isValid(req.params.card_id)){
    Card.findOne({_id:req.params.card_id}, function(err, card){
console.log('objectid');
      if(err) return res.status(500).json({error: err});
      if(!card) return res.status(404).json({error : 'card not found'});
      res.json(card);
    })
  }else{
    Card.findOne({card_id: req.params.card_id}, function(err, card){
console.log('normalid');
      if(err) return res.status(500).json({error: err});
      if(!card) return res.status(404).json({error : 'card not found'});
      res.json(card);
    })
  }

});

router.post('/', function(req, res){
  var card = new Card();


  if(!req.body.card_id){
    card.card_id = card._id;
  }else{
    card.card_id = req.body.card_id;
  }
  console.log(new Date() + 'CARDS POST');
  console.log(req.body);
  card.title = req.body.title;
  card.mainImgUrl = req.body.mainImgUrl;
  card.marrageDate = new Date(req.body.marrageDate);
  card.coupleInfo.groom.name = req.body.coupleInfo.groom.name;
  card.coupleInfo.groom.tel = req.body.coupleInfo.groom.tel;
  card.coupleInfo.groom.photo = req.body.coupleInfo.groom.photo;
  card.coupleInfo.bride.name = req.body.coupleInfo.bride.name;
  card.coupleInfo.bride.tel = req.body.coupleInfo.bride.tel;
  card.coupleInfo.bride.photo = req.body.coupleInfo.bride.photo;
  card.description = req.body.description;
  card.photos = req.body.photos;
  card.location.lon = req.body.location.lon;
  card.location.lat = req.body.location.lat;
  card.location.title = req.body.location.title;
  card.uploadedPhoto = req.body.uploadedPhoto;
  card.location.addr = req.body.location.addr;
  card.subImgUrl = req.body.subImgUrl;

  card.save(function(err){
    if(err){
      console.error(err);
      res.json({result:0});
      return ;
    }
  });
  res.json({result:card._id });
});

router.put('/:card_id', function(req, res){
  let opt = {};
  if(mongoose.Types.ObjectId.isValid(req.params.card_id)){
    opt = {_id:req.params.card_id};
  }else{
    opt = {card_id: req.params.card_id};
  }
  Card.findOne(opt, function(err, card){
    if(err) return res.status(500).json({error: err});
    if(!card) return res.status(404).json({error : 'card not found'});

    if(!req.body.card_id){
      card.card_id = card._id;
    }else{
      card.card_id = req.body.card_id;
    }
    console.log(new Date() + 'CARDS PUT');
    console.log(req.body);
    if(req.body.title) card.title = req.body.title;
    if(req.body.mainImgUrl) card.mainImgUrl = req.body.mainImgUrl;
    if(req.body.marrageDate) card.marrageDate = new Date(req.body.marrageDate);
    if(req.body.coupleInfo.groom.name) card.coupleInfo.groom.name = req.body.coupleInfo.groom.name;
    if(req.body.coupleInfo.groom.tel) card.coupleInfo.groom.tel = req.body.coupleInfo.groom.tel;
    if(req.body.coupleInfo.groom.photo) card.coupleInfo.groom.photo = req.body.coupleInfo.groom.photo;
    if(req.body.coupleInfo.bride.name) card.coupleInfo.bride.name = req.body.coupleInfo.bride.name;
    if(req.body.coupleInfo.bride.tel) card.coupleInfo.bride.tel = req.body.coupleInfo.bride.tel;
    if(req.body.coupleInfo.bride.photo) card.coupleInfo.bride.photo = req.body.coupleInfo.bride.photo;
    if(req.body.description) card.description = req.body.description;
    if(req.body.photos) card.photos = req.body.photos;
    if(req.body.location.lon) card.location.lon = req.body.location.lon;
    if(req.body.location.lat) card.location.lat = req.body.location.lat;
    if(req.body.location.title) card.location.title = req.body.location.title;
    if(req.body.uploadedPhoto) card.uploadedPhoto = req.body.uploadedPhoto;
    if(req.body.location.addr) card.location.addr = req.body.location.addr;
    if(req.body.subImgUrl) card.subImgUrl = req.body.subImgUrl;
    if(req.body.regDttm) card.regDttm = req.body.regDttm;

    card.save(function(err){
        if(err) res.status(500).json({error: 'failed to update'});
        res.json({message: 'card updated'});
    });
  })
});

const deleteForderRecursive = function(path) {
  if(fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file, index) => {
      const curPath = Path.join(path, file);
      if(fs.lstatSync(curPath).isDirectory()){
        deleteForderRecursive(curPath);
      }else{
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

router.delete('/:card_id', function(req, res){
  Card.remove({ _id: req.params.card_id }, function(err, output){
        if(err) return res.status(500).json({ error: "database failure" });
        fs.exists('./public/static/attache/'+req.params.card_id,function(flag){
          if(flag){
            deleteForderRecursive('./public/static/attache/'+req.params.card_id);
          }
        });
        /* ( SINCE DELETE OPERATION IS IDEMPOTENT, NO NEED TO SPECIFY )
        if(!output.result.n) return res.status(404).json({ error: "book not found" });
        res.json({ message: "book deleted" });
        */

        res.status(204).end();
    })
});

export default router;
