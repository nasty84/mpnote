import React, {Component} from 'react';

class ImageListItem extends Component{

  render(){

    return(
      <div className="col-md-2 col-xs-6"
        draggable='true'
		    onDragStart={this.props.dragStart}
		    onDragEnd={this.props.dragEnd}
		    data-id={this.props.order}>
      <div className="thumbnail">
        <img src={this.props.data} />
        <button className="btn btn-danger btn-xs btn_close" data-id={this.props.order} onClick={this.props.delImage} type="button">x</button>
      </div>
      </div>
    )
  }
}

export default ImageListItem;
