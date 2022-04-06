import React, {Component} from 'react';
import FormUser from './FormUser';

class EditUser extends Component{
  render(){
    return <FormUser {...this.props} action="edit"/>;
  }
}

export default EditUser;
