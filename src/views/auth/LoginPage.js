import React, {Component} from "react";
import API from '../../api/api';

import { connect } from 'react-redux'
import { login } from '../../actions';

import validation from '../../lang/sr/validation';

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Col,
} from "reactstrap";

import SimpleReactValidator from 'simple-react-validator';

class LoginPage extends Component {
  state = {
    username: '',
    password: '',
    usernameFocus: false,
    passwordFocus: false
  }
  
  handleLogin = () => {
    if (this.validator.allValid()) {
      API.post('api/login', {username: this.state.username, password: this.state.password, type: 'cms'})
        .then(result => {
          localStorage.setItem('token', result.data.token);
          this.props.login(result.data.user);
          window.location.href = '/';
        });
    } else {
      this.validator.showMessages();

      this.forceUpdate();
    }
  };
  
  handleChange=(event)=>{
    this.setState({[event.target.name]:event.target.value });
  } 
  
  componentDidMount(){
    document.body.style.background = "#f4f3ef";
    if(localStorage.token){
      this.handleGetUser();
    }
    
    document.body.classList.add("login-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }
  
  componentWillUnmount(){
    document.body.classList.remove("login-page");
    document.body.classList.remove("sidebar-collapse");
  }
  
  componentWillMount() {
    // Serbian
    SimpleReactValidator.addLocale('sr', validation);
    this.validator = new SimpleReactValidator({locale: 'sr'});
  }
  
  setUsernameFocus = (value) => {
    this.setState({
      usernameFocus: value
    });
  }
  
  setPasswordFocus = (value) => {
    this.setState({
      passwordFocus: value
    });
  }
  
  handleGetUser = () => {
    API.get('api/user')
      .then(result => {
        this.props.login(result.data.data);

        if(this.props.user){
            window.location.href = '/';
        }
      });
  };
  
  render(){
    
    return (
      <>
        <div className="content">
          <Container>
            <Col className="ml-auto mr-auto mt-5" md="8">
              <Card className="card-login">
                <Form action="" className="form" method="">
                  <CardHeader className="text-center">
                    <div>
                      <img style={{width: "20%"}}
                        alt="..."
                        src={require("../../logo.png").default}
                      ></img>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <InputGroup
                      className={
                      "no-border input-lg" +
                        (this.state.usernameFocus ? " input-group-focus" : "")
                      }
                    >
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="now-ui-icons users_circle-08"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Korisničko ime"
                        type="text"
                        name="username"
                        value={this.state.username} 
                        onChange={this.handleChange}
                        onFocus={() => this.setUsernameFocus(true)}
                        onBlur={() => this.setUsernameFocus(false)}
                      ></Input>
                    </InputGroup>
                    <InputGroup>
                      {this.validator.message('korisničko ime', this.state.username, 'required|alpha')}
                    </InputGroup>
                    <InputGroup
                      className={
                          "no-border input-lg" +
                          (this.state.passwordFocus ? " input-group-focus" : "")
                        }
                      >
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="now-ui-icons ui-1_lock-circle-open"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Lozinka"
                        type="text"
                        name="password"
                        value={this.state.password} 
                        onChange={this.handleChange}
                        onFocus={() => this.setPasswordFocus(true)}
                        onBlur={() => this.setPasswordFocus(false)}
                      ></Input>
                    </InputGroup>
                    <InputGroup>
                      {this.validator.message('lozinka', this.state.password, 'required|alpha_num')}
                    </InputGroup>
                    <InputGroup>
                    </InputGroup>
                  </CardBody>
                  <CardFooter className="text-center">
                    <Button
                      block
                      className="btn-round"
                      color="info"
                      type="button"
                      onClick={this.handleLogin}
                    >
                      Uloguj se
                    </Button>
                  </CardFooter>
                </Form>
              </Card>
            </Col>
          </Container>
        </div>
      </>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
