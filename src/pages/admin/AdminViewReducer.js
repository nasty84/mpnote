import {Map, List} from 'immutable';
import {browserHistory} from 'react-router';
import { RECEIVE_CARD_ADMIN_DATA_COMPLETE, RECEIVE_CARD_ADMIN_DATA_ERROR, UPLOAD_COMPLETE,CARD_DATA_UPDATE_ERROR, CARD_DATA_UPDATE_COMPLETE,SORT_PHOTO_LIST  } from '../../constants/ActionTypes';

const adminViewInitialState ={

    description:'<p></p>',
    uploadedPhoto:[]

};

export default function AdminViewReducer(state = adminViewInitialState, action = null){
  switch(action.type){
    case RECEIVE_CARD_ADMIN_DATA_COMPLETE:
      return action.data;
    case RECEIVE_CARD_ADMIN_DATA_ERROR:
      return state;
    case UPLOAD_COMPLETE:
      let newObj = Object.assign({},state);
      newObj.uploadedPhoto.push(action.imageUrl);
      let uniq = newObj.uploadedPhoto.reduce(function(a,b){
                	if (a.indexOf(b) < 0 ) a.push(b);
                	return a;
                  },[]);
      newObj.uploadedPhoto = uniq;
      return newObj;
    case SORT_PHOTO_LIST:
      let newObjs = Object.assign({}, state);
      console.log(action);
      if(action.opt === 'asc'){
        newObjs.uploadedPhoto.sort(function(a, b){
          const splitA = a.split('/')[4];
          const splitB = b.split('/')[4];
          return splitA < splitB ? -1 : splitA > splitB ? 1 : 0;
        });
      }else{
        newObjs.uploadedPhoto.sort(function(a, b){
          const splitA = a.split('/')[4];
          const splitB = b.split('/')[4];
          return splitA > splitB ? -1 : splitA < splitB ? 1 : 0;
        });
      }
      // newObjs.uploadedPhoto = [];
      return newObjs;
    case CARD_DATA_UPDATE_COMPLETE:
      if(action.isFirst===false){
        alert('저장완료');
        return state;
      }else{
        let newObj = Object.assign({},state);
        newObj.redirectId = action.data.data;
        return newObj;
      }

    case CARD_DATA_UPDATE_ERROR:
      console.log(action.error);
      alert('오류가 발생했습니다.');
      return state;
    default:
      return state;
  }
}
