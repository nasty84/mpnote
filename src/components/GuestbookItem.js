import React from 'react';
import Moment from 'react-moment';
import 'moment-timezone';

class GuestbookItem extends React.Component{
  openLayer(e){
    let { item, _deleteItem } = this.props;
    e.preventDefault();
    this.refs.deleteItem.classList.toggle("layer_open");
  }

  closeLayer(e){
    setTimeout(() => this.refs.deleteItem.classList.remove("layer_open"), 10);
  }
  formSubmit(e){
    let { item, _deleteItem } = this.props;
    e.preventDefault();
    _deleteItem({id:item._id, password:this.refs.password.value});
    this.closeLayer();
  }
  render(){
    let { item } = this.props;
    return(
      <div className="guestbook_item">
        <span className="tit_name"><i className="ico_name"></i>{item.name}</span>
        <span className="reg_date"><i className="ico_date"></i><Moment format="YYYY-MM-DD HH:mm"   tz="Asia/Seoul">{item.regDttm}</Moment></span>
        <p className="text" dangerouslySetInnerHTML={{__html: item.text}}></p>
        <a href="#" className="btn_del" onClick={this.openLayer.bind(this)}>삭제</a>
        <div className="layer_delete" ref="deleteItem">
          <form onSubmit={this.formSubmit.bind(this)}>
            <label htmlFor={"delPassword"+item._id}>비밀번호를 입력해주세요</label>
            <input type="password" id={"delPassword"+item._id} name={"pwd"+item._id} ref="password" className="tf_pw" />
            <div className="wrap_btn">
              <input type="submit" value="확인" className="btn_submit"/>
              <input type="reset" onClick={this.closeLayer.bind(this)} value="취소" className="btn_cancel"/>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default GuestbookItem;
