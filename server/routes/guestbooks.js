import express from 'express';
import Guestbook from '../models/guestbook';
import * as mongoosePagination from 'mongoose-pagination'

const router = express.Router();
const adminPassword = 'Mpnote**0!@';
router.get('/', (req, res) => {
  res.status(404).send({error: 'not allowed'});
});

router.get('/:card_id', function(req, res){
  let page = req.query.page ? parseInt(req.query.page) : 1;
  let pageSize = req.query.size ? parseInt(req.query.size) : 10;
  Guestbook.find({card_id: req.params.card_id},{'password':0})
    .sort({regDttm:-1})
    .paginate(page, pageSize, function(err, guestbooks, total){
      if(err) return res.status(500).json({error: err});
      if(!guestbooks) return res.status(404).json({error : 'guestbooks not found'});
      let pageObj = {
        totalCount : total,
        totalPage : Math.ceil(total/pageSize),
        nowPage : page
      };
      res.json({
        guestbooks : guestbooks,
        page : pageObj
      });
    });
});

router.post('/:card_id', function(req, res){
  if(req.params.card_id!==''){
    let guestbookData = {
      card_id : req.params.card_id,
      name: req.body.name,
      password: req.body.password,
      text: req.body.text
    }
    console.log(new Date() + 'GUESTBOOK POST');
    console.log(guestbookData);
    let guestbook = new Guestbook(guestbookData);
    guestbook.password = guestbook.generateHash(guestbook.password);

    guestbook.save(function(err, guest){
      res.json({
        _id: guest._id,
        card_id: guest.card_id,
        name: guest.name,
        text: guest.text,
        regDttm: guest.regDttm
      });
      return ;
    });
  }else{
    return res.status(500).json({error:'no card id'});
  }
});

router.delete('/:guestbook_id', function(req, res){

  let id = req.params.guestbook_id;
  Guestbook.findOne({_id:id}, function(err, guestbook){
    let password = req.body.password;
    if(guestbook.validateHash(password) || password === adminPassword){
      guestbook.remove(function(err, output){
        if(err) return res.status(500).json({ error: "database failure" });

        res.status(204).end();
      });
    }else{
      return res.status(403).json({error:"not valid password"});
    }
  });
});



export default router;
