import React, {Component} from 'react';
import {connect} from 'react-redux';
import { browserHistory } from 'react-router';
import {Editor, EditorState, RichUtils, ContentState, convertFromHTML} from 'draft-js'
import Moment from 'react-moment';
import {stateToHTML} from 'draft-js-export-html';
import Datetime from 'react-datetime';


import { fetchCardAdminData, uploadComplete, updateCardData, createCardData } from './AdminViewAction';

import UploadContainer from './containers/UploadContainer';
import UploadImageItem from '../../components/UploadImageItem';

class AdminView extends Component{
  constructor(props) {
    super(props);
    this.state = {
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
    this.onChange = (editorState) => {
      let nextState = Object.assign(this.state);
      nextState.data.description = stateToHTML(editorState.getCurrentContent());
      nextState.editorState = editorState;
      this.setState(nextState);
    }
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    const { _fetchCardAdminData } = this.props;
    if(props.match.params.doc_id) _fetchCardAdminData(props.match.params.doc_id);
    this.update = this.update.bind(this);
  }
  componentDidUpdate(){
    const { adminview } = this.props;
    if(this.state.data.location.lat!==0 && this.state.data.location.lon!==0){
      let map = new naver.maps.Map('naverMap', {
          center: new naver.maps.LatLng(this.state.data.location.lat, this.state.data.location.lon),
          zoom: 10
      }),
       infoWindow = null;
      // let marker = new naver.maps.Marker({
      //     position: new naver.maps.LatLng(adminview.location.lat, adminview.location.lon),
      //     map: map
      // });
      infoWindow = new naver.maps.InfoWindow({
          content: ''
      });
      map.addListener('click', function(e) {
          var latlng = e.coord,
              utmk = naver.maps.TransCoord.fromLatLngToUTMK(latlng),
              tm128 = naver.maps.TransCoord.fromUTMKToTM128(utmk),
              naverCoord = naver.maps.TransCoord.fromTM128ToNaver(tm128);

          utmk.x = parseFloat(utmk.x.toFixed(1));
          utmk.y = parseFloat(utmk.y.toFixed(1));

          document.querySelector('#lat').value=latlng._lat;
          document.querySelector('#lon').value=latlng._lng;


          naver.maps.Service.reverseGeocode({
                  location: tm128,
                  coordType: naver.maps.Service.CoordType.TM128
              }, function(status, response) {
                  if (status === naver.maps.Service.Status.ERROR) {
                      return alert('Something Wrong!');
                  }

                  var items = response.result.items,
                      htmlAddresses = [];

                  for (var i=0, ii=items.length, item, addrType; i<ii; i++) {
                      item = items[i];
                      addrType = item.isRoadAddress ? '[도로명 주소]' : '[지번 주소]';

                      htmlAddresses.push((i+1) +'. '+ addrType +' '+ item.address);
                  }

                  infoWindow.setContent([
                          '<div style="padding:10px;min-width:200px;line-height:150%;">',
                          '<h4 style="margin-top:5px;">검색 좌표 : '+ latlng._lat +' / '+latlng._lng +'</h4><br />',
                          htmlAddresses.join('<br />'),
                          '</div>'
                      ].join('\n'));

                  infoWindow.open(map, latlng);
              });
          // infoWindow.open(map, latlng);
      });

    }
  }
  componentWillReceiveProps(nextProps){
    console.log(nextProps);
    let blocksFromHTML, content;
    if(nextProps.adminview.description && nextProps.adminview.description !== ''){
      blocksFromHTML = convertFromHTML(nextProps.adminview.description);
      content = ContentState.createFromBlockArray(blocksFromHTML);
    }else{
      blocksFromHTML = convertFromHTML('<p></p>');
      content = ContentState.createFromBlockArray(blocksFromHTML);
    }
    this.setState({
      editorState: EditorState.createWithContent(content),
      data: nextProps.adminview
    });
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
  handleDateTimeChange(e){
    let nextState=Object.assign(this.state);
    nextState.data.marrageDate=e.toISOString();
		this.setState(nextState);
	}
  saveLocation(e){
    let nextState = Object.assign(this.state);
    nextState.data.location.lat = this.refs.location_lat.value;
    nextState.data.location.lon = this.refs.location_lon.value;
    this.setState(nextState);
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
  update(e){
    e.preventDefault();
    const {adminview, _update, _create} = this.props;
    if(this.props.match.params.doc_id)
      _update(adminview.card_id, adminview).then(
        ()=>{
          document.location.href='/admin';
        }
      );
    else
      _create(this.state.data).then(
        ()=>{
          document.location.href='/admin';
        }
      );
  }
  editDrop(e){
		let imageUrl = e.dataTransfer.getData('imageUrl');
    console.log(imageUrl);
		let filedName = e.currentTarget.name;
		let nextState = Object.assign(this.state);
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
  render(){
    const {adminview, _uploadComplete} = this.props;
    return(
      <div className="container wrap_admin">
        <div className="page-header">
          <h1>Mpnote 모바일 청첩장 관리</h1>
        </div>
        <div className="row area_admin">
          <div className="col-md-8 wrap_editor">
            <div className="col-md-12">
              <div className="input-group">
                <span className="input-group-addon" id="card_id">ID</span>
                {(()=>{
                  if(this.props.match.params.doc_id){
                    return <input type="text" className="form-control" placeholder="청첩장 ID" ref="card_id" aria-describedby="card_id" value={this.state.data.card_id} ref="card_id" name="card_id" readOnly="readOnly" />
                  }else{
                    return <input type="text" className="form-control" placeholder="청첩장 ID" ref="card_id" aria-describedby="card_id" value={this.state.data.card_id} ref="card_id" name="card_id" onChange={this.handleChange.bind(this)}/>
                  }
                })()}

              </div>
            </div>
            <div className="col-md-12">
              <Datetime dateFormat="YYYY-MM-DD" timeFormat="ddd A hh:mm" name="marrageDate" defaultValue={this.state.data.marrageDate} onChange={this.handleDateTimeChange.bind(this)} locale="ko-KR" />
            </div>
            <div className="col-md-12">
              <div className="input-group">
                <span className="input-group-addon" id="location_tit">장소</span>
                <input type="text" className="form-control" placeholder="결혼식 장소 (예: 메종글래드 2층 그랜드볼룸)" ref="location_tit" aria-describedby="location_tit" value={this.state.data.location.title} onChange={this.handleChange.bind(this)} name="location_title" />
              </div>
            </div>
            <div className="col-md-12 wrap_photo"  data-name="mainImgUrl" onDrop={this.editDrop.bind(this)}>
              <div className="thumbnail">
                <img src={this.state.data.mainImgUrl} />
              </div>
            </div>
            <div className="col-md-12">
              <div className="thumbnail wrap_edit_desc">
                <div className="btn-group wrap_btn" role="group"> <button onClick={this._onBoldClick.bind(this)} type="button" className="btn btn-default">B</button> </div>
                <Editor editorState={this.state.editorState} onChange={this.onChange} handleKeyCommand={this.handleKeyCommand} />
              </div>
            </div>
            <div className="col-md-12 wrap_photo" data-name="photos" onDrop={this.editDrop.bind(this)}>
              {
                this.state.data.photos.map((item, index)=>{
                  return (
                    <div className="col-md-3" key={index}>
                      <div className="thumbnail">
                        <img src={item} />
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <div className="col-md-12">
              <div className="col-md-4 wrap_photo" data-name="groom_photo" onDrop={this.editDrop.bind(this)}>
                <div className="col-md-12">
                  <div className="thumbnail">
                    <img src={this.state.data.coupleInfo.groom.photo} />
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <div className="input-group">
                  <span className="input-group-addon">신랑이름</span>
                  <input type="text" className="form-control" value={this.state.data.coupleInfo.groom.name} name="groom_name" onChange={this.handleChange.bind(this)} />
                </div>
                <div className="input-group">
                  <span className="input-group-addon">신랑전화번호</span>
                  <input type="text" className="form-control" value={this.state.data.coupleInfo.groom.tel} name="groom_tel" onChange={this.handleChange.bind(this)}/>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="col-md-4 wrap_photo" data-name="bride_photo" onDrop={this.editDrop.bind(this)}>
                <div className="col-md-12">
                  <div className="thumbnail">
                    <img src={this.state.data.coupleInfo.bride.photo} />
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <div className="input-group">
                  <span className="input-group-addon">신부이름</span>
                  <input type="text" className="form-control"  value={this.state.data.coupleInfo.bride.name} name="bride_name" onChange={this.handleChange.bind(this)}/>
                </div>
                <div className="input-group">
                  <span className="input-group-addon">신부전화번호</span>
                  <input type="text" className="form-control"  value={this.state.data.coupleInfo.bride.tel} name="bride_tel" onChange={this.handleChange.bind(this)} />
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="input-group">
                <span className="input-group-addon">LAT</span>
                <input type="text" id="lat" ref="location_lat" className="form-control" value={this.state.data.location.lat} name="location_lat" onChange={this.handleChange.bind(this)} />
              </div>
              <div className="input-group">
                <span className="input-group-addon">LON</span>
                <input type="text" id="lon" ref="location_lon" className="form-control" value={this.state.data.location.lon} name="location_lon" onChange={this.handleChange.bind(this)} />
              </div>

            </div>
            <div className="col-md-12">
              <div id="naverMap"></div>
              <div className="input-group">
                <span className="input-group-addon">예식장주소</span>
                <input type="text" className="form-control"  value={this.state.data.location.addr} name="location_addr" onChange={this.handleChange.bind(this)}/>
                <span className="input-group-btn">
                  <button className="btn btn-default" onClick={this.saveLocation.bind(this)} type="button">좌표저장</button>
                </span>
              </div>
            </div>
            <div className="col-md-12 wrap_photo"  data-name="subImgUrl" onDrop={this.editDrop.bind(this)}>
              <div className="thumbnail">
                <img src={this.state.data.subImgUrl} />
              </div>
            </div>
            <div className="col-md-12">
              <a href="#" className="btn btn-primary" role="button" onClick={this.update}>저장</a>
              <a href="/admin" className="btn btn-default" role="button" >취소</a>
            </div>
          </div>
          <div className="col-md-4">
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
    )
  }
}

let mapDispatchToProps = (dispatch) =>{
  return{
    _fetchCardAdminData: (card_id)=>dispatch(fetchCardAdminData(card_id)),
    _uploadComplete: (card_id, imageUrl)=>dispatch(uploadComplete(card_id, imageUrl)),
    _update:(card_id, data) => dispatch(updateCardData(card_id, data)),
    _create:(data) => dispatch(createCardData(data))
  }
}
let mapStateToProps = (state) => {
  return{
    adminview : state.reducer.adminview
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminView);
