import express from 'express';
import Card from '../models/card';
import * as mongoosePagination from 'mongoose-pagination'
import moment from 'moment';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/:card_id', function(req, res){
	console.log(req.params.card_id);
  if(mongoose.Types.ObjectId.isValid(req.params.card_id)){
	console.log(1);
    Card.findOne({_id:req.params.card_id}, function(err, card){
      if(err) return res.status(500).json({error: err});
      if(!card) return res.status(404).json({error : 'card not found'});
      res.render('index', {
        data:card,
        moment:moment
      });
    })
  }else{
	console.log(2);
    Card.findOne({card_id: req.params.card_id}, function(err, card){
      if(err) return res.status(500).json({error: err});
      if(!card) return res.status(404).json({error : 'card not found'});
      res.render('index', {
        data:card,
        moment:moment
      });
    })
  }

});

export default router;
