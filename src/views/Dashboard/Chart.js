import react, {Component} from 'react';

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle
} from "reactstrap";

import { Line} from "react-chartjs-2";

class Chart extends Component{
  render(){
    const chart = {
      responsive: true,
      data: {
        labels: this.props.data?.labels,
        datasets: [{
          borderColor: "#6bd098",
          backgroundColor: "#6bd098",
          pointRadius: 2,
          pointHoverRadius: 5,
          borderWidth: 3,
          tension: 0.4,
          fill: false,
          data: this.props.data?.datasets
        }]
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
        }
      }
    };
    
    return(
      <Card>
        <CardHeader>
          <CardTitle tag="h5">{this.props.title}</CardTitle>
        </CardHeader>
        <CardBody>
          <Line
            data={chart.data}
            options={chart.options}
            width={400}
            height={100}
          />
        </CardBody>
        <CardFooter>
        </CardFooter>
      </Card>
    );
  }
}

export default Chart;
