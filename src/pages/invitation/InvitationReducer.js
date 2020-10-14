import { REQUEST_CARD, FETCH_CARD_DATA, RECEIVE_CARD_DATA_COMPLETE, RECEIVE_CARD_DATA_ERROR } from '../../constants/ActionTypes';

const invitationInitialState = {
  card_id: '',
  coupleInfo: {
    bride: {
      name: '',
      tel: '',
      photo: ''
    },
    groom: {
      name: '',
      tel: '',
      photo: ''
    }
  },
  description: '',
  mainImgUrl: '',
  subImgUrl: '',
  marrageDate: '',
  photos: [
    
  ],
  title: '',
  location: {
    title:'',
    lat: 0,
    lon: 0,
    addr: ''
  }
}

export default function InvitationReducer(state = invitationInitialState, action = null){
  switch(action.type){
    case REQUEST_CARD :
      return{
        msg: 'request'
      };
    case FETCH_CARD_DATA:
      return{
        msg: 'fetch'
      };
    case RECEIVE_CARD_DATA_COMPLETE:
      return Object.assign({}, state, action.data.data);
    case RECEIVE_CARD_DATA_ERROR:
      return state

    default:
      return state;
  }
}
