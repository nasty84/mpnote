import React from 'react';
import {connect} from 'react-redux';

import { fetchGuestbookData, postGuestbook, fetchGuestbookAllData, deleteGuestbook } from './GuestbookAction';
import GuestbookWrite from '../../../components/GuestbookWrite';
import GuestbookItem from '../../../components/GuestbookItem';

class Guestbook extends React.Component{
  componentDidMount(){
    const { card_id, _fetchGuestbookData } = this.props;
    if(card_id) _fetchGuestbookData(card_id, 1);
  }
  deleteItem(obj){
    const {card_id, _deleteGuestbook} = this.props;
    _deleteGuestbook(card_id, obj.id, obj.password);
  }
  morePage(e){
    const { card_id, _fetchGuestbookData, guestbook } = this.props;
    e.preventDefault();
    if(guestbook.page.nowPage < guestbook.page.totalPage){
      _fetchGuestbookData(card_id, guestbook.page.nowPage+1);
    }
  }
  totalPage(e){
    const { card_id, _fetchGuestbookAllData, guestbook } = this.props;
    e.preventDefault();
    if(guestbook.page.nowPage < guestbook.page.totalPage){
      _fetchGuestbookAllData(card_id, guestbook.page.totalCount);
    }
  }
  getGuestbookList(){
    const { guestbook } = this.props;
    if(guestbook.guestbooks.length > 0){
      return <ul className="list_guestbook">
        {guestbook.guestbooks.map((item, index) =>{
            return(
              <li key={index}>
                <GuestbookItem item={item} _deleteItem={this.deleteItem.bind(this)} />
              </li>
            );
        })}
      </ul>
    }else{
      return(
        <div className="no_guestbook">글이 없습니다</div>
      )
    }
  }
  postGuestbook(data){
    const { card_id, _postGuestbook } = this.props;
    _postGuestbook(card_id, data);
  }
  render(){
    const { guestbook, card_id } = this.props;
    return(
      <div>
        <GuestbookWrite card_id={card_id} _onSubmit={this.postGuestbook.bind(this)}/>
        <div className="tit_comment">Comment</div>
        {this.getGuestbookList()}
        {(()=>{
          if(guestbook.guestbooks.length > 0){
            return (
              <div className="wrap_btn">
                <a href="#" onClick={this.morePage.bind(this)} className="btn_more">더보기</a>
                <a href="#" onClick={this.totalPage.bind(this)} className="btn_all">전체보기</a>
              </div>
            )
          }
        })()}
      </div>
    )
  }
}

let mapStateToProps = (state) => {
  return{
    guestbook : state.reducer.guestbook
  }
}
let mapDispatchToProps = (dispatch) =>{
  return{
    _fetchGuestbookData: (card_id, page, size=5)=>dispatch(fetchGuestbookData(card_id, page, size)),
    _postGuestbook:(card_id, data)=>dispatch(postGuestbook(card_id, data)),
    _fetchGuestbookAllData: (card_id, size)=>dispatch(fetchGuestbookAllData(card_id, size)),
    _deleteGuestbook:(card_id, _id, password)=>dispatch(deleteGuestbook(card_id, _id, password))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Guestbook);
