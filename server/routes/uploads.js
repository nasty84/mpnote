import express from 'express';
import multiparty from 'multiparty';
import fs from 'fs';
import path from 'path';

const router = express.Router();

router.post('/:card_id', (req, res, next) => {
  var form = new multiparty.Form();
  var card_id = req.params.card_id;
  var uploadedFiles = [];
  var filename;

  // console.log(req.filename);
  fs.exists('./public/static/attache/'+card_id,function(flag){
    if(!flag){
      fs.mkdir('./public/static/attache/'+card_id, function(){
        form.parse(req);
      });
    }else{
      form.parse(req);
    }
  });

	// get field name & value
	form.on('field',function(name,value){
		// console.log('normal field / name = '+name+' , value = '+value);
	});

	// file upload handling
	form.on('part',function(part){
		var size;

		if (part.filename) {
			filename = part.filename;
			size = part.byteCount;
		}else{
			part.resume();

		}

		var writeStream = fs.createWriteStream(path.resolve('./','public/static/attache')+'/'+card_id+'/'+filename);
		part.pipe(writeStream);

		part.on('data',function(chunk){
			// console.log(filename+' read '+chunk.length + 'bytes');
		});

		part.on('end',function(){
			// console.log(filename+' Part read complete');
			writeStream.end();
		});
	});

	// all uploads are completed
	form.on('close',function(){
		res.status(200).send({
      'url' : '/static/attache/'+card_id+'/'+filename
    });
	});

	// track progress
	form.on('progress',function(byteRead,byteExpected){
		console.log(' Reading total  '+byteRead+'/'+byteExpected);
	});


});

export default router;
