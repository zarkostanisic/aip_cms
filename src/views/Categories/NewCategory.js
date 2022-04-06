import React, {Component} from 'react';
import FormCategory from './FormCategory';

class NewCategory extends Component{
  render(){
    return <FormCategory {...this.props} action="create"/>
  }
}

export default NewCategory;
