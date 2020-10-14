import * as types from '../../../constants/ActionTypes';
import axios from 'axios';
// import { fetch } from 'redux-thunk';

// export function fetchCardData(){
//   const api = '/cards/nasty';
//   return{
//     type: types.FETCH_CARD_DATA
//   }
// }

export function receiveGuestbookdDataComplete(data){
  return { type : 'RECEIVE_GUESTBOOK_DATA_COMPLETE', data: data}
}
export function receiveGuestbookdAllDataComplete(data){
  return { type : 'RECEIVE_GUESTBOOK_ALL_DATA_COMPLETE', data: data}
}
export function receiveGuestbookDataError(err){
  return {
    type : 'RECEIVE_GUESTBOOK_DATA_ERROR'
  }
}

export function deleteGuestbookComplete(data){
  return{
    type: 'DELETE_GUESTBOOK_COMPLETE',
    data: data
  }
}

export function deleteGuestbookError(err){
  return{
    type: 'DELETE_GUESTBOOK_ERROR',
    data: err
  }
}

export function fetchGuestbookData(card_id, page, size){
  return dispatch => {
    return axios.get('/guestbooks/'+card_id+'?page='+page+'&size='+size)
            .then((response) => {
              dispatch(receiveGuestbookdDataComplete(response))
            })
            .catch((err) => {
              dispatch(receiveGuestbookDataError(err))
            })
  }
}

export function fetchGuestbookAllData(card_id, size){
  return dispatch => {
    return axios.get('/guestbooks/'+card_id+'?page=1&size='+size)
            .then((response) => {
              dispatch(receiveGuestbookdAllDataComplete(response))
            })
            .catch((err) => {
              dispatch(receiveGuestbookDataError(err))
            })
  }
}

export function deleteGuestbook(card_id, _id, password){
  return dispatch => {
    return axios.delete('/guestbooks/'+_id, {data:{password : password}})
            .then((response)=>{
              dispatch(deleteGuestbookComplete(response));
              dispatch(fetchGuestbookAllData(card_id, 5));
            })
            .catch((err) => {
              dispatch(deleteGuestbookError(err.response))
            })
  }
}

export function postGuestbookComplete(data){
  return { type: 'POST_GUESTBOOK_COMPLETE', data: data}
}

export function postGuestbookError(err){
  return{
    type: 'POST_GUESTBOOK_ERROR'
  }
}

export function postGuestbook(card_id, data){
  return dispatch => {
    return axios.post('/guestbooks/'+card_id, data)
            .then((response)=>{
              dispatch(postGuestbookComplete(response))
            })
            .catch((err)=>{
              dispatch(postGuestbookError(err))
            })
  }
}
