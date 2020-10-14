import React, {Component} from 'react';
import ImageListItem from '../../../components/ImageListItem';

let placeholder = document.createElement("div");
placeholder.className = "placeholder col-md-2 col-xs-6";

class ImageListContainer extends Component{

  dragStart(e){
		this.dragged = e.currentTarget;
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text/html', this.dragged);
		placeholder.style.height=e.currentTarget.clientHeight+'px';
	}
	dragOver(e) {
		if(typeof(this.dragged)!=='undefined' && this.dragged!==null) {
			this.dragged.style.display = "none";
			if (e.target.className.indexOf('placeholder')>-1) return;
			this.over = e.target;
      // console.log(this.over);
			//리스트.insertBefore(넣을 element,기준점)
      if(e.currentTarget.dataset.name==='photos' && this.over.className.indexOf('col-xs-6')>-1) e.currentTarget.insertBefore(placeholder, this.over);
		}
	}
	dragEnd(e) {
		this.dragged.style.display = 'block';
		this.dragged.parentNode.removeChild(placeholder);

		let fromIndex = Number(this.dragged.dataset.id);
		let toIndex = Number(this.over.dataset.id);
		this.props._onReorder(fromIndex, toIndex);
		this.over = null;
		this.dragged = null;
	}
  render(){

    return(
      <div className="col-sm-10">
      <div className="thumbnail" data-name={this.props._dataName} onDrop={this.props._onDrop} onDragOver={this.dragOver.bind(this)}>
        {this.props.data.map((item, index)=>{
          return <ImageListItem
                  data={item}
                  key={index}
                  dragStart={this.dragStart.bind(this)}
					        dragEnd={this.dragEnd.bind(this)}
					        order={index}
                  delImage={this.props.delImage}/>
        })}
        </div>
      </div>
    )
  }
}

export default ImageListContainer;
