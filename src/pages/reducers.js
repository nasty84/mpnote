import { combineReducers } from 'redux';
import invitation from './invitation/InvitationReducer';
import guestbook from './invitation/containers/GuestbookReducer';
import adminlist from './admin/AdminListReducer';
import adminview from './admin/AdminViewReducer';

const reducer = combineReducers({
  invitation,
  guestbook,
  adminlist,
  adminview
});

export default reducer;
