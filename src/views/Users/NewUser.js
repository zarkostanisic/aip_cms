import React, {Component} from 'react';
import FormUser from './FormUser';

class NewUser extends Component{
  render(){
    return <FormUser {...this.props} action="create"/>;
  }
}

export default NewUser;
