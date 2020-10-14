import * as types from '../../constants/ActionTypes';
import axios from 'axios';
// import { fetch } from 'redux-thunk';

// export function fetchCardData(){
//   const api = '/cards/nasty';
//   return{
//     type: types.FETCH_CARD_DATA
//   }
// }

export function receiveCardListDataComplete(data){
  return { type : 'RECEIVE_CARD_LIST_DATA_COMPLETE', data: data.data}
}

export function receiveCardListDataError(err){
  return {
    type : 'RECEIVE_CARD_LIST_DATA_ERROR'
  }
}

export function delCardDataComplete(data){
  alert('삭제완료');
  location.href='/admin';
}
export function delCardDataError(err){
  console.log('삭제오류');
}

export function fetchCardListData(page, size){
  console.log(page+'/'+size);
  return dispatch => {
    return axios.get('/cards/?page='+page+'&size='+size)
            .then((response) => {
              console.log(response);
              dispatch(receiveCardListDataComplete(response))
            })
            .catch((err) => {
              console.log(err);
              dispatch(receiveCardListDataError(err))
            })
  }
}

export function delCardData(id){
  return dispatch => {
    return axios.delete('/cards/'+id)
      .then((response)=>{
        console.log(response);
        dispatch(delCardDataComplete(response))

      })
      .catch((err)=>{
        console.log(Err);
        dispatch(delCardDataError(err))
      })
  }
}
