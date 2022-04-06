import React, {Component} from 'react';
import FormPost from './FormPost';

class NewPost extends Component{
  render(){
    return <FormPost {...this.props} action="create"/>
  }
}

export default NewPost;
