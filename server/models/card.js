import mongoose from 'mongoose';

const Schema = mongoose.Schema;

var cardSchema = new Schema({
  card_id : {type: String, index: {unique: true}},
  title: {type:String, default:''},
  mainImgUrl : {type:String, default:''},
  subImgUrl : {type:String, default:''},
  marrageDate : { type: Date, default: Date.now},
  coupleInfo : {
    groom : {
      name : {type:String, default:''},
      tel : {type:String, default:''},
      photo: {type:String, default:''}
    },
    bride : {
      name : {type:String, default:''},
      tel : {type:String, default:''},
      photo: {type:String, default:''}
    }
  },
  description : {type:String, default:'<p></p>'},
  photos : {type:Array, default:[]},
  location : {
    title : {type:String, default:''},
    lat : {type:Number, default:33.5058653},
    lon : {type:Number, default:126.5264036},
    addr: {type:String, default:''}
  },
  regDttm : {type: Date, default: Date.now},
  uploadedPhoto : {type:Array, default:[]}
});


module.exports = mongoose.model('card', cardSchema);
