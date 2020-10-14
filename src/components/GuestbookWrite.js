import React from 'react';

class GuestbookWrite extends React.Component{
  formSubmit(e){
    e.preventDefault();
    let data = {
      name :this.refs.name.value.trim(),
      password : this.refs.password.value.trim(),
      text : this.refs.text.value.trim().replace(/\n/g, "<br>")
    };
    if (data.name==='' || data.password==='' || data.text==='') {
      alert('입력 정보가 올바르지 않습니다.\n이름 혹은 비밀번호나 내용이 제대로 들어가 있는지 확인해주세요');
      return;
    }else{
      this.props._onSubmit(data);
      this.refs.name.value='';
      this.refs.password.value='';
      this.refs.text.value='';
    }
  }
  render(){
    const { card_id, _onSubmit } = this.props;
    return(
      <div className="form_write">
        <form onSubmit={this.formSubmit.bind(this)}>
          <fieldset>
            <div className="form_row">
              <label htmlFor="name">Name</label>
              <input type="text" ref="name" name="name" id="name" />
            </div>
            <div className="form_row">
              <label htmlFor="password">Password</label>
              <input type="password" ref="password" id="password" name="password" />
            </div>
            <div className="form_row">
              <label htmlFor="text">Message</label>
              <textarea ref="text" name="text" id="text"></textarea>
            </div>
            <input type="submit" value="submit" className="btn_submit" />
          </fieldset>
        </form>
      </div>
    )
  }
}

export default GuestbookWrite;
