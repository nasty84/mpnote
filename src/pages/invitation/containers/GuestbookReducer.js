import { REQUEST_GUESTBOOK, FETCH_GUESTBOOK_DATA, RECEIVE_GUESTBOOK_DATA_COMPLETE, RECEIVE_GUESTBOOK_DATA_ERROR, POST_GUESTBOOK_COMPLETE, RECEIVE_GUESTBOOK_ALL_DATA_COMPLETE, DELETE_GUESTBOOK_COMPLETE, DELETE_GUESTBOOK_ERROR } from '../../../constants/ActionTypes';

const guestbookInitialState = {
  guestbooks : [],
  page:{
    totlaCount : 0,
    totalPage: 0,
    nowPage: 1
  }
};

export default function GuestbookReducer(state = guestbookInitialState, action = null){
  switch(action.type){
    case REQUEST_GUESTBOOK :
      return{
        msg: 'request'
      };
    case FETCH_GUESTBOOK_DATA:
      return{
        msg: 'fetch'
      };
    case RECEIVE_GUESTBOOK_DATA_COMPLETE:
      return {
        guestbooks : state.guestbooks.concat(action.data.data.guestbooks),
        page: action.data.data.page
      }
    case RECEIVE_GUESTBOOK_DATA_ERROR:
      return state
    case POST_GUESTBOOK_COMPLETE:
      return {
          guestbooks : [
  				...state.guestbooks.slice(0, 0),
  				action.data.data,
  				...state.guestbooks.slice(0, state.guestbooks.length)
  			],
        page: state.page
      }
    case RECEIVE_GUESTBOOK_ALL_DATA_COMPLETE:
      return{
        guestbooks : action.data.data.guestbooks,
        page: action.data.data.page
      }
    case DELETE_GUESTBOOK_COMPLETE:
      alert('삭제되었습니다.');
      return state;
    case DELETE_GUESTBOOK_ERROR:
      if(action.data.status===403){
        alert('비밀번호가 잘못되었습니다.');
      }
      return state
    default:
      return state;
  }
}
