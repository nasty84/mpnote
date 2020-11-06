import * as types from '../../constants/ActionTypes';
import axios from 'axios';
// import { fetch } from 'redux-thunk';

// export function fetchCardData(){
//   const api = '/cards/nasty';
//   return{
//     type: types.FETCH_CARD_DATA
//   }
// }

export function receiveCardAdminDataComplete(data){
  return { type : 'RECEIVE_CARD_ADMIN_DATA_COMPLETE', data: data.data}
}

export function receiveCardAdminDataError(err){
  return {
    type : 'RECEIVE_CARD_ADMIN_DATA_ERROR'
  }
}

export function cardDataUpdateComplete(isFst, data){
  return{
    isFirst : isFst,
    type: 'CARD_DATA_UPDATE_COMPLETE',
    data: data
  }
}

export function cardDataUpdateError(err){
  return {
    type : 'CARD_DATA_UPDATE_ERROR',
    error: err
  }
}

export function fetchCardAdminData(card_id){
  return dispatch => {
    return axios.get('/cards/'+card_id)
            .then((response) => {
              dispatch(receiveCardAdminDataComplete(response))
            })
            .catch((err) => {
              console.log(err);
              dispatch(receiveCardAdminDataError(err))
            })
  }
}

export function uploadComplete(card_id, imageUrl){
  return { type : 'UPLOAD_COMPLETE', imageUrl:imageUrl}
}


export function updateCardData(card_id, data){
  return dispatch => {
    return axios.put('/cards/'+card_id, data)
            .then((response)=>{
              dispatch(cardDataUpdateComplete(false, response));
            })
            .catch((err)=>{
              dispatch(cardDataUpdateError(err));
            })
  }
}

export function createCardData(isFst, data){
  return dispatch => {
    return axios.post('/cards/',data)
            .then((response)=>{
              dispatch(cardDataUpdateComplete(isFst, response));
            })
            .catch((err)=>{
              dispatch(cardDataUpdateError(err));
            })
  }
}

export function sortPhotoList(opt) {
  return { type: 'SORT_PHOTO_LIST', opt:opt}
}