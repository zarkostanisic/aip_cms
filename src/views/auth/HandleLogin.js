import React, {Component} from 'react';
import API from '../../api/api';

import { connect } from 'react-redux'
import { login } from '../../actions';

class HandleLogin extends Component{
  componentDidMount(){
    if(localStorage.token){
      this.handleGetUser();
    }else{
      this.props.history.push('/login');
    }
  }
  
  handleGetUser = () => {
    API.get('api/user')
      .then(result => {
        this.props.login(result.data.data);

        if(!this.props.user){
            this.props.history.push('/login');
        }
      });
  };
  
  render(){
    return(null);
  }
}

const mapStateToProps = (state) => {
   return {
      user: state.auth.user
   };
};
const mapDispatchToProps = (dispatch) => {
   return {
      login: (user) => dispatch(login(user)),
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(HandleLogin);
