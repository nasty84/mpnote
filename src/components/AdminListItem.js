import React, {Component} from 'react';

class AdminListItem extends Component{
  render(){
    const {item} = this.props;
    return(
      <div className="col-sm-6 col-md-3">
        <div className="thumbnail">
          <img src={item.mainImgUrl?item.mainImgUrl:'/static/images/no-img.png'} className="img_list" />
          <div className="caption">
            <h3>{item.coupleInfo.groom.name} / {item.coupleInfo.bride.name}</h3>
            <p></p>
            <p>
              <a href={"/card/"+item._id} className="btn btn-primary" role="button" target="_blank">미리보기</a>
              <a href={"/admin/view/"+item._id} className="btn btn-primary" role="button">수정</a>
              <a href="#" onClick={this.props.onDelete} data-id={item._id} className="btn btn-danger" role="button">삭제</a>
            </p>
          </div>
        </div>
      </div>
    )
  }
}

export default AdminListItem;
