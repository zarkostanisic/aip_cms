import React, {Component} from 'react';
import FormPost from './FormPost';

class EditPost extends Component{
  render(){
    return <FormPost {...this.props} action="edit"/>
  }
}

export default EditPost;
