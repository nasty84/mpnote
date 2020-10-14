import React, {Component} from 'react';

class UploadImageItem extends Component{
  dragStart(e){
    e.dataTransfer.setData('imageUrl',this.props.data);
  }
  render(){
    return <div className="col-md-6" draggable="true" onDragStart={this.dragStart.bind(this)}>
      <div className="thumbnail">
        <img src={this.props.data} />
      </div>
    </div>
  }
}

export default UploadImageItem;
