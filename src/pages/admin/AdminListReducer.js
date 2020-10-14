import {Map, List} from 'immutable';
import { RECEIVE_CARD_LIST_DATA_COMPLETE, RECEIVE_CARD_LIST_DATA_ERROR } from '../../constants/ActionTypes';

const adminListInitialState = Map({
  cardlist : List.of(),
  page: null
});

export default function AdminListReducer(state = adminListInitialState, action = null){
  switch(action.type){
    case RECEIVE_CARD_LIST_DATA_COMPLETE:
      return state.set('cardlist', List(action.data.cards)).set('page',Map(action.data.page));
    case RECEIVE_CARD_LIST_DATA_ERROR:
      return state;
    default:
      return state;
  }
}
