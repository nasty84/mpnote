import React from 'react';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import 'moment-timezone';

import { fetchCardData } from './InvitationCardAction';
import PhotoGallery from './containers/PhotoGallery';
import Guestbook from './containers/Guestbook';

import '../../styles/reset.scss';
import '../../styles/slick.scss';

class InvitationCard extends React.Component{
  constructor(props){
    super(props);
    const { _fetchCardData } = this.props;
    _fetchCardData(props.match.params.card_id);
  }

  componentDidUpdate(){
    const { invitation } = this.props;
    if(invitation.location.lat!==0 && invitation.location.lon!==0){
      let map = new naver.maps.Map('naverMap', {
          center: new naver.maps.LatLng(invitation.location.lat, invitation.location.lon),
          zoom: 10
      });
      map.setOptions({ //지도 인터랙션 끄기
            draggable: false,
            pinchZoom: false,
            scrollWheel: false,
            keyboardShortcuts: false,
            disableDoubleTapZoom: true,
            disableDoubleClickZoom: true,
            disableTwoFingerTapZoom: true
        });
      let marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(invitation.location.lat, invitation.location.lon),
          map: map
      });
    }
  }
  render(){
    const { invitation } = this.props;
    return(
      <div className="area_invitation">
        <header className="invitation_head">
          <h1 className="screen_out">INVITATION</h1>
          <img src="/static/images/bg_header.png" className="img_header" width="100%" height="auto" />
        </header>
        <div className="wrap_info">
          <div className="tit_date"><Moment format="YYYY.MM.DD" tz="Asia/Seoul">{invitation.marrageDate}</Moment></div>
          <div className="time_marry"><Moment format="ddd A hh:mm"  tz="Asia/Seoul">{invitation.marrageDate}</Moment></div>
          <div className="tit_location">{invitation.location.title}</div>
        </div>
        <div className="wrap_main_img">
          <img src={invitation.mainImgUrl} className="img_main" width="100%" height="auto" />
          <div dangerouslySetInnerHTML={{__html: invitation.description}} className="description"></div>
        </div>
        <div className="photo_slider">
          <h2 className="tit_gallery">Gallery</h2>
          {(()=>{
            if(invitation.photos.length>0) return <PhotoGallery photos = {invitation.photos}/>
          })()}

        </div>
        <div className="logo_mpnote">
          <h2 className="logo">photographed by Mpnote Studio</h2>
        </div>
        <div className="wrap_couple">
          <img src="/static/images/bg_marry.png" className="bg_marry" width="100%" height="auto" />
          <div className="profile">
            <div className="groom">
              <img src={invitation.coupleInfo.groom.photo} className="img_couple img_groom" width="100%" height="auto" />
              <p className="name">{invitation.coupleInfo.groom.name}</p>
              <div className="button">
                <a href={'tel:'+invitation.coupleInfo.groom.tel} className="btn_tel">전화하기</a>
                <a href={'sms:'+invitation.coupleInfo.groom.tel} className="btn_sms">문자하기</a>
              </div>
            </div>
            <div className="bride">
              <img src={invitation.coupleInfo.bride.photo} className="img_couple img_bride" width="100%" height="auto" />
              <p className="name">{invitation.coupleInfo.bride.name}</p>
                <div className="button">
                  <a href={'tel:'+invitation.coupleInfo.bride.tel} className="btn_tel">전화하기</a>
                  <a href={'sms:'+invitation.coupleInfo.bride.tel} className="btn_sms">문자하기</a>
                </div>

            </div>
          </div>
        </div>
        <div className="wrap_map">
          <h2 className="tit_map">Location</h2>
          <div id="naverMap"></div>
          <a href={'https://m.map.naver.com/map.nhn?lat='+invitation.location.lat+'&lng='+invitation.location.lon+'&dlevel=10&mapMode=3&pinType=place&pinTitle='+invitation.location.title} className="btn_view_map">네이버 지도보기</a>
          <p className="location_title">{invitation.location.title}</p>
          <p className="location_addr">{invitation.location.addr}</p>
          <div className="traffic_info">
            <a href={'https://m.map.naver.com/map.nhn?lat='+invitation.location.lat+'&lng='+invitation.location.lon+'&dlevel=10&mapMode=3&pinType=place&pinTitle='+invitation.location.title} className="btn_bus"><i className="ico_traffic"></i>BUS INFO</a>
            <a href={'https://m.map.naver.com/map.nhn?lat='+invitation.location.lat+'&lng='+invitation.location.lon+'&dlevel=10&mapMode=3&pinType=place&pinTitle='+invitation.location.title} className="btn_subway"><i className="ico_traffic"></i>SUBWAY INFO</a>
          </div>
        </div>
        <div className="wrap_guestbook">
          <img src={invitation.subImgUrl} className="img_guestbook" width="100%" height="auto" />
          <img src="/static/images/tit_guestbook.png" className="tit_guestbook" width="100%" height="auto" />
          <p className="desc_guestbook">신랑 신부에게 축하 메세지를 남겨주세요</p>
          <Guestbook card_id={this.props.match.params.card_id}/>
        </div>
        <footer className="invitation_foot">
          <img src="/static/images/footer.png" className="img_footer" width="100%" height="auto" />
        </footer>
      </div>
    )
  }
}
let mapDispatchToProps = (dispatch) =>{
  return{
    _fetchCardData: (card_id)=>dispatch(fetchCardData(card_id))
  }
}
let mapStateToProps = (state) => {
    return {
			invitation : state.reducer.invitation
		};
};

export default connect(mapStateToProps, mapDispatchToProps)(InvitationCard);
