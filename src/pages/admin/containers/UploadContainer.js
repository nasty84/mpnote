import React, {Component} from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';

class UploadContainer extends Component{
  onDrop(files){
    const {onUploadComplete, cardId} = this.props;

		files.forEach((file)=>{
			let data = new FormData();
			data.append('file', file);
			axios.post('/uploads/'+cardId,data)
				.then(response=>{
					if(response.status === 200){
            onUploadComplete(cardId, response.data.url);          
					}
				})
				.catch(error=>{
					console.log(error);
				});
		});
  }

  render(){

    return(
      <div className="col-md-12">
        <Dropzone onDrop={this.onDrop.bind(this)} className="box_upload">
          <div className="desc_upload">이미지 파일을 이곳에 끌어 넣거나<br/>클릭하여 파일을 선택 해 주세요</div>
        </Dropzone>
      </div>
    )
  }
}

export default UploadContainer;
