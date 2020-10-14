import * as types from '../../constants/ActionTypes';
import axios from 'axios';
// import { fetch } from 'redux-thunk';

// export function fetchCardData(){
//   const api = '/cards/nasty';
//   return{
//     type: types.FETCH_CARD_DATA
//   }
// }

export function receiveCardDataComplete(data){
  return { type : 'RECEIVE_CARD_DATA_COMPLETE', data: data}
}

export function receiveCardDataError(err){
  return {
    type : 'RECEIVE_CARD_DATA_ERROR'
  }
}

export function fetchCardData(card_id){
  return dispatch => {
    return axios.get('/cards/'+card_id)
            .then((response) => {
              dispatch(receiveCardDataComplete(response))
            })
            .catch((err) => {
              dispatch(receiveCardDataError(err))
            })
  }
}
