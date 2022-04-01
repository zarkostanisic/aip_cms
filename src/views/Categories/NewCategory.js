import React, {Component} from "react";
import {Link} from "react-router-dom";
import API from '../../api/api';
import validation from '../../lang/sr/validation';
import SimpleReactValidator from 'simple-react-validator';

import {
  FormGroup,
  Label,
  Input,
  FormText,
  Row,
  Col,
  Card,
  CardHeader,
  CardTitle,
  CardBody
} from "reactstrap";

import {Button} from "reactstrap";

class NewCategory extends Component {
  state = {
    name: '',
    error_message_name: ''
  }
  
  handleSave = () => {
    if (this.validator.allValid()) {
      let results = API.post('api/categories', {name: this.state.name})
        .then(result => {
          this.props.history.push('/admin/categories');
        }).catch((error) => {
          if(error.response.status == 422){
            const errors = error.response.data.errors;
            
            (errors['name'] !== undefined) ?
              this.setState({ error_message_name: errors['name'][0] }) :
              this.setState({ error_message_name: '' });
          }
        });
    } else {
      this.validator.showMessages();
      
      this.forceUpdate();
    }
  }
  
  handleChange=(event)=>{
    this.setState({[event.target.name]:event.target.value });
  } 
  
  componentWillMount() {
    // Serbian
    SimpleReactValidator.addLocale('sr', validation);
    this.validator = new SimpleReactValidator({locale: 'sr'});
  }
  
  render(){
    return (
      <>
        <div className="content">
          <Row>
            <Col md="6">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">
                    Nova kategorija
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <form>
                    <FormGroup>
                      <Label for="name">Naziv</Label>
                      <Input
                        type="name"
                        name="name"
                        value={this.state.name} 
                        onChange={this.handleChange}
                      />
                      <FormText color="muted">
                        {this.validator.message('naziv', this.state.name, 'required|string')}
                        {this.state.error_message_name}
                      </FormText>
                    </FormGroup>
                    <Button color="primary" type="button" onClick={() => this.handleSave()}>
                      Sačuvaj
                    </Button>
                  </form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
};

export default NewCategory;
