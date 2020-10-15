import React, {Component} from 'react';
import {connect} from 'react-redux';
import { browserHistory } from 'react-router';
import Moment from 'react-moment';
import Datetime from 'react-datetime';
import {Editor, EditorState, RichUtils, ContentState} from 'draft-js';
import {convertFromHTML} from 'draft-convert';
import {stateToHTML} from 'draft-js-export-html';

import { fetchCardAdminData, uploadComplete, updateCardData, createCardData } from './AdminViewAction';
import ImageListContainer from './containers/ImageListContainer';
import UploadContainer from './containers/UploadContainer';
import UploadImageItem from '../../components/UploadImageItem';

class NewAdminView extends Component{
  constructor(props) {
    super(props);
    let initialState = {
      editorState: EditorState.createEmpty(),
      data:{
        mainImgUrl:'',
        subImgUrl:'',
        card_id:'',
        location:{
          title:'',
          lon:126.5264036,
          lat:33.5058653,
          addr:'',
        },
        photos:[],
        coupleInfo:{
          bride:{
            name:'',
            tel:'',
            photo:''
          },
          groom:{
            name:'',
            tel:'',
            photo:''
          }
        },
        marrageDate:new Date()
      }
    };
		this.state = initialState;
    const { _fetchCardAdminData } = this.props;
    if(props.match.params.doc_id) _fetchCardAdminData(props.match.params.doc_id);
    this.onChange = (editorState) => {
      let nextState = Object.assign(this.state);
      nextState.data.description = stateToHTML(editorState.getCurrentContent());
      nextState.editorState = editorState;
      this.setState(nextState);
    }
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }
  componentDidMount(){
    document.body.className='admin';
    const {_create} = this.props;
    if(!this.props.match.params.doc_id)
      _create(true, this.state.data).then(
        ()=>{

        }
      );
    window.addEventListener('message', this.onPostMessage.bind(this));
  }
  onPostMessage(e){
    if(e.data.type==='map'){
      let nextState = Object.assign({}, this.state);
      nextState.data.location.addr = e.data.location_addr;
      nextState.data.location.lon = e.data.location_lon;
      nextState.data.location.lat = e.data.location_lat;
      this.setState(nextState);
    }
  }
  componentDidUpdate(){

  }
  componentWillReceiveProps(nextProps){
    if(nextProps.adminview.redirectId && nextProps.adminview.redirectId.result!==0){
      document.location.href='/admin/view/'+nextProps.adminview.redirectId.result;
    }else{
      let blocksFromHTML;
      if(nextProps.adminview.description && nextProps.adminview.description !== ''){
        blocksFromHTML = convertFromHTML(nextProps.adminview.description.replace(/<\p><br><\/p>/gi,'<p></p>'));
      }else{
        blocksFromHTML = convertFromHTML('<p></p>');
      }
      nextProps.adminview.marrageDate = new Date(nextProps.adminview.marrageDate);
      this.setState({
        editorState: EditorState.createWithContent(blocksFromHTML),
        data: nextProps.adminview,
        isPoppedOut: false
      });
    }
  }
  handleChange(e){
		let nextState = Object.assign(this.state);
    switch(e.target.name){
      case 'location_lon':
        nextState.data.location.lon = e.target.value;
        break;
      case 'location_lat':
        nextState.data.location.lat = e.target.value;
        break;
      case 'location_title':
        nextState.data.location.title = e.target.value;
        break;
      case 'location_addr':
        nextState.data.location.addr = e.target.value;
        break;
      case 'bride_name':
        nextState.data.coupleInfo.bride.name = e.target.value;
        break;
      case 'bride_tel':
        nextState.data.coupleInfo.bride.tel = e.target.value;
        break;
      case 'groom_name':
        nextState.data.coupleInfo.groom.name = e.target.value;
        break;
      case 'groom_tel':
        nextState.data.coupleInfo.groom.tel = e.target.value;
        break;
      default :
        nextState.data[e.target.name] = e.target.value;
        break;
    }
		this.setState(nextState);
	}
  handleDateTimeChange(e){
    let nextState=Object.assign(this.state);
    nextState.data.marrageDate=new Date(e);
    this.setState(nextState);
  }
  update(e){
    e.preventDefault();
    const {adminview, _update, _create} = this.props;
    if(this.props.match.params.doc_id)
      _update(adminview._id, adminview).then(
        ()=>{
          document.location.href='/admin';
        }
      );
    else
      _create(false, this.state.data).then(
        ()=>{
          document.location.href='/admin';
        }
      );
  }
  handleKeyCommand(command) {
     const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
     if (newState) {
       this.onChange(newState);
       return 'handled';
     }
     return 'not-handled';
   }
  _onBoldClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }
  openMap(e){
    window.open('/admin/maps','_blank','width=700,height=800');
  }
  editDrop(e){
  	let imageUrl = e.dataTransfer.getData('imageUrl');
    if(imageUrl==='') return;
  	let filedName = e.currentTarget.name;
  	let nextState = Object.assign({}, this.state);
  	if(filedName==="" || typeof(fieldName)==='undefined') filedName = e.currentTarget.dataset.name;
    switch(filedName){
      case 'photos':
        nextState.data.photos.push(imageUrl);
        break;
      case 'groom_photo':
        nextState.data.coupleInfo.groom.photo = imageUrl;
        break;
      case 'bride_photo':
        nextState.data.coupleInfo.bride.photo = imageUrl;
        break;
      default:
        nextState.data[filedName] = imageUrl;
        break;
    }
    this.setState(nextState);
  }
  delImage(e){
    let fieldName = e.currentTarget.dataset.name;

    let nextState = Object.assign({}, this.state);
    switch(fieldName){
      case 'groom_photo':
        nextState.data.coupleInfo.groom.photo = '';
        break;
      case 'bride_photo':
        nextState.data.coupleInfo.bride.photo = '';
        break;
      default:
        nextState.data[fieldName] = '';
        break;
    }
    this.setState(nextState);
  }
  photosReorder(from, to){

    let nextState = Object.assign({}, this.state);
    let idxFrom = from, idxTo = to;
    if(idxFrom < idxTo) idxTo--;
    nextState.data.photos.splice(idxTo, 0, nextState.data.photos.splice(idxFrom, 1)[0]);
    this.setState(nextState);
  }
  // ...state.slice(0,action.index),
	// 			...state.slice(action.index+1, state.length)
  photosDel(e){
    let idx = e.currentTarget.dataset.id;
    let nextState = Object.assign({}, this.state);
    let len = nextState.data.photos.length;

    nextState.data.photos.splice(idx,1);
    this.setState(nextState);
  }
  render(){
    const {adminview, _uploadComplete} = this.props;
    const card_id_readable = adminview.card_id ? true : false;
    return(
      <div>
        <nav className="navbar navbar-default navbar-static-top">
          <div className="container">
            <div className="navbar-custom-menu">
              <ul className="nav navbar-nav">
                <li>
                  <div className="btn-group">
                    <a href="#" className="btn btn-primary" onClick={this.update.bind(this)}>저장</a>
                  </div>
                  <div className="btn-group">
                    <a href="/admin" className="btn btn-danger">취소</a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="container wrap_admin">
          <div className="page-header">
            <h1>Mpnote 모바일 청첩장 관리</h1>
          </div>
          <div className="row admin_cont">
            <div className="col-md-8 wrap_editor">
              <div className="col-md-12">
                <form className="form-horizontal">
                  <fieldset>
                    <legend>기본정보</legend>
                    <div className="form-group">
                      <label htmlFor="card_id" className="col-sm-2 control-label">청첩장 ID</label>
                      <div className="col-sm-10">
                        <input type="text"
                         className="form-control"
                         id="card_id"
                         placeholder="주소가 될 ID를 입력"
                         value={this.state.data.card_id}
                         ref="card_id" name="card_id"
                         onChange={this.handleChange.bind(this)} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="location_tit" className="col-sm-2 control-label">예식장소</label>
                      <div className="col-sm-10">
                        <input type="text"
                          className="form-control"
                          placeholder="결혼식 장소 (예: 메종글래드 2층 그랜드볼룸)"
                          ref="location_tit"
                          aria-describedby="location_tit"
                          id="location_tit"
                          value={this.state.data.location.title}
                          onChange={this.handleChange.bind(this)}
                          name="location_title" />
                        </div>
                      </div>
                      <div className="form-group">
                      <label htmlFor="location_tit" className="col-sm-2 control-label"></label>
                        <div className="col-sm-8">
                          <input type="text"
                            className="form-control"
                            placeholder="웨딩홀 주소"
                            ref="location_addr"
                            aria-describedby="location_addr"
                            id="location_addr"
                            value={this.state.data.location.addr}
                            onChange={this.handleChange.bind(this)}
                            name="location_addr" />
                          <input type="hidden" name="location_lat" value={this.state.data.location.lat} id="location_lat" />
                          <input type="hidden" name="location_lon" value={this.state.data.location.lon} id="location_lon" />
                      </div>
                      <div className="col-sm-2">
                        <button className="btn btn-default"
                          onClick={this.openMap}
                          type="button">장소 지정</button>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-sm-2 control-label">예식시간</label>
                      <div className="col-sm-10">
                        <Datetime dateFormat="YYYY-MM-DD"
                          timeFormat="ddd A hh:mm"
                          name="marrageDate"
                          value={this.state.data.marrageDate}
                          onChange={this.handleDateTimeChange.bind(this)}
                          locale="ko-KR" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-sm-2 control-label">신랑정보</label>
                      <div className="col-sm-5">
                        <input type="text"
                          className="form-control"
                          value={this.state.data.coupleInfo.groom.name}
                          name="groom_name"
                          onChange={this.handleChange.bind(this)}
                          placeholder="신랑 이름" />
                      </div>
                      <div className="col-sm-5">
                        <input type="text"
                          className="form-control"
                          value={this.state.data.coupleInfo.groom.tel}
                          name="groom_tel"
                          onChange={this.handleChange.bind(this)}
                          placeholder="연락처" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-sm-2 control-label">신부정보</label>
                      <div className="col-sm-5">
                        <input type="text"
                          className="form-control"
                          value={this.state.data.coupleInfo.bride.name}
                          name="bride_name"
                          onChange={this.handleChange.bind(this)}
                          placeholder="신부 이름" />
                      </div>
                      <div className="col-sm-5">
                        <input type="text"
                          className="form-control"
                          value={this.state.data.coupleInfo.bride.tel}
                          name="bride_tel"
                          onChange={this.handleChange.bind(this)}
                          placeholder="연락처" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-sm-2 control-label">모시는 글</label>
                      <div className="col-sm-10">
                        <div className="thumbnail wrap_edit_desc">
                          <div className="btn-group wrap_btn" role="group"> <button onClick={this._onBoldClick.bind(this)} type="button" className="btn btn-default">B</button> </div>
                          <Editor editorState={this.state.editorState}
                            onChange={this.onChange}
                            handleKeyCommand={this.handleKeyCommand} />
                        </div>
                      </div>
                    </div>
                  </fieldset>
                  <fieldset>
                    <legend>이미지 정보</legend>
                    <div className="form-group">
                      <label className="col-sm-2 control-label">신랑/신부 이미지</label>
                      <div className="col-sm-5">

                          {(()=>{
                            if(this.state.data.coupleInfo.groom.photo){
                              return(
                                <div className="thumbnail" data-name="groom_photo" onDrop={this.editDrop.bind(this)}>
                                  <img src={this.state.data.coupleInfo.groom.photo} />
                                  <button className="btn btn-xs btn-danger btn_close" data-name="groom_photo" onClick={this.delImage.bind(this)} type="button">x</button>
                                </div>
                              );
                            }else{
                              return (
                                <div className="thumbnail" data-name="groom_photo" onDrop={this.editDrop.bind(this)}>
                                  <span>신랑 이미지를 여기로 끌어넣어주세요</span>
                                </div>
                              );
                            }
                          })()}
                      </div>
                      <div className="col-sm-5">
                          {(()=>{
                            if(this.state.data.coupleInfo.bride.photo){
                              return (
                                <div className="thumbnail" data-name="bride_photo" onDrop={this.editDrop.bind(this)}>
                                  <img src={this.state.data.coupleInfo.bride.photo} />
                                  <button className="btn btn-xs btn-danger btn_close" data-name="bride_photo" onClick={this.delImage.bind(this)} type="button">x</button>
                                </div>
                              )
                            }else{
                              return (
                                <div className="thumbnail" data-name="bride_photo" onDrop={this.editDrop.bind(this)}>
                                  <span>신부 이미지를 여기로 끌어넣어주세요</span>
                                </div>
                              )
                            }
                          })()}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-sm-2 control-label">이미지 리스트</label>
                      {(()=>{
                        if(this.state.data.photos.length>0){
                          return <ImageListContainer data-name="photos"
                            data={this.state.data.photos}
                            _onReorder={this.photosReorder.bind(this)}
                            _onDrop={this.editDrop.bind(this)}
                            _dataName="photos"
                            delImage={this.photosDel.bind(this)} />
                        }else{
                          return <div className="col-sm-10"><div className="thumbnail" data-name="photos" onDrop={this.editDrop.bind(this)}>이미지를 끌어넣어주세요</div></div>
                        }
                      })()}

                    </div>
                    <div className="form-group">
                      <label className="col-sm-2 control-label">메인이미지</label>
                      <div className="col-sm-10">

                          {(()=>{
                            if(this.state.data.mainImgUrl){
                              return(
                                <div className="thumbnail" data-name="mainImgUrl" onDrop={this.editDrop.bind(this)}>
                                  <img src={this.state.data.mainImgUrl} />
                                  <button className="btn btn-xs btn-danger btn_close" data-name="mainImgUrl" onClick={this.delImage.bind(this)} type="button">x</button>
                                </div>
                              );
                            }else{
                              return (
                                <div className="thumbnail" data-name="mainImgUrl" onDrop={this.editDrop.bind(this)}>
                                  <span>이미지를 여기로 끌어넣어주세요</span>
                                </div>
                              );
                            }
                          })()}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-sm-2 control-label">서브이미지</label>
                      <div className="col-sm-10">

                          {(()=>{
                            if(this.state.data.subImgUrl){
                              return(
                                <div className="thumbnail" data-name="subImgUrl" onDrop={this.editDrop.bind(this)}>
                                  <img src={this.state.data.subImgUrl} />
                                  <button className="btn btn-xs btn-danger btn_close" data-name="subImgUrl" onClick={this.delImage.bind(this)} type="button">x</button>
                                </div>
                              );
                            }else{
                              return (
                                <div className="thumbnail" data-name="subImgUrl" onDrop={this.editDrop.bind(this)}>
                                  <span>이미지를 여기로 끌어넣어주세요</span>
                                </div>
                              );
                            }
                          })()}
                      </div>
                    </div>
                  </fieldset>
                </form>
              </div>
            </div>
            <div className="col-md-4 wrap_uploader">
              <UploadContainer onUploadComplete={_uploadComplete} cardId={adminview.card_id} />
              <div className="col-md-12">
                {
                adminview.uploadedPhoto.map((item, index)=>{
                    return (
                      <UploadImageItem data={item} key={index} />
                    )
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


let mapDispatchToProps = (dispatch) =>{
  return{
    _fetchCardAdminData: (card_id)=>dispatch(fetchCardAdminData(card_id)),
    _uploadComplete: (card_id, imageUrl)=>dispatch(uploadComplete(card_id, imageUrl)),
    _update:(card_id, data) => dispatch(updateCardData(card_id, data)),
    _create:(isFst, data) => dispatch(createCardData(isFst, data))
  }
}
let mapStateToProps = (state) => {
  return{
    adminview : state.reducer.adminview
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(NewAdminView);
