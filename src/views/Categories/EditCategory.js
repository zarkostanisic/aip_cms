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

class EditCategory extends Component {
  state = {
    name: ''
  }
  
  handleUpdate = () => {
    if (this.validator.allValid()) {
      var results = API.patch('api/categories/' + this.props.match.params.id, {name: this.state.name})
        .then(result => {
          this.props.history.push('/admin/categories');
        });
    } else {
      this.validator.showMessages();
    
      this.forceUpdate();
    }
  }
  
  handleChange=(event)=>{
    this.setState({[event.target.name]:event.target.value });
  } 
  
  getCategory = () => {
    
    if(this.props.match.params.id){
      var result = API.get('api/categories/' + this.props.match.params.id)
        .then(result => {
          console.log(result);
          this.setState({
            name: result.data.data.name
          });
        });
    }
  }
  
  componentWillMount() {
    // Serbian
    SimpleReactValidator.addLocale('sr', validation);
    this.validator = new SimpleReactValidator({locale: 'sr'});
  }
  
  componentDidMount(){
     this.getCategory();
  }
  
  render(){
    return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">
                    Izmena kategorije
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <FormGroup>
                    <Label for="name">Naziv</Label>
                    <Input
                      type="name"
                      name="name"
                      placeholder="Vodopadi"
                      value={this.state.name} 
                      onChange={this.handleChange}
                    />
                    <FormText color="muted">
                      {this.validator.message('naziv', this.state.name, 'required|alpha')}
                    </FormText>
                  </FormGroup>
                  <Button color="primary" type="button" onClick={() => this.handleUpdate()}>
                    Sačuvaj
                  </Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
};

export default EditCategory;
