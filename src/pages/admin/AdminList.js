import React from 'react';
import { connect } from 'react-redux';

import { fetchCardListData, delCardData } from './AdminListAction';

import AdminListItem from '../../components/AdminListItem';
import Pagination from '../../utils/Pagination';

class AdminList extends React.Component{
  constructor(props){
    super(props);
  }

  componentDidMount(){
    const { _fatchCardListData } = this.props;
    _fatchCardListData(this.props.match.params.page || 1);
  }
  delItem(e){
    if(confirm('삭제하시겠습니까?')){
      const { _deleteCard } = this.props;
      e.preventDefault();
      _deleteCard(e.currentTarget.dataset.id);
    }
  }
  handlePageChange(idx) {
      location.href='/admin/p/' + idx;
    }
  render(){
    const { admin } = this.props;
    let paging = admin.get("page");
    return(
      <div className="container admin_list">
        <div className="page-header">
          <h1>Mpnote 모바일 청첩장 관리</h1>
        </div>
        <div className="row">
          {
            admin.get('cardlist').map((item, index)=>{
              return <AdminListItem item={item} key={index} onDelete={this.delItem.bind(this)} />
            })
          }

        </div>
        <a href="/admin/view" className="btn btn-primary">등록</a>
        {(() => {
          if (paging)
            return <Pagination
                activePage={paging.get("nowPage")}
                itemsCountPerPage={20}
                totalItemsCount={paging.get("totalCount")}
                pageRangeDisplayed={10}
                onChange={this.handlePageChange.bind(this)}
            />
        })()}
      </div>
    )
  }
}
let mapDispatchToProps = (dispatch) =>{
  return{
    _fatchCardListData:(page=1,size=20) => dispatch(fetchCardListData(page,size)),
    _deleteCard:(id) => dispatch(delCardData(id))

  }
}
let mapStateToProps = (state) => {
  return{
    admin : state.reducer.adminlist
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminList);
