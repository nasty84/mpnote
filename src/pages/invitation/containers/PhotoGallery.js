import React from 'react';
import Slider from 'react-slick';

class PhotoGallery extends React.Component{
  render(){
    const {photos} = this.props;
    let options = {
      customPaging: function(i){
        return <a><img src={photos[i]} /></a>
      },
      dots: true,
      dotsClass: 'list_thumb',
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: false
    }
    let slideItem = (photos || []).map((item, index)=>{
      return (
        <div key={index}>
          <img src={item} />
        </div>
      )
    })
    return(
      <div className="slider">
        <Slider {...options}>
          {slideItem}
        </Slider>
      </div>
    )
  }
}
export default PhotoGallery;
