import React, {Component} from 'react';
import FormCategory from './FormCategory';

class EditCategory extends Component{
  render(){
    return <FormCategory {...this.props} action="edit"/>
  }
}

export default EditCategory;
