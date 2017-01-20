import 'whatwg-fetch';

import React from 'react';
import { Sparklines, SparklinesLine, SparklinesText } from 'react-sparklines';

class CoverageChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      point: { x: 0, y: 0 },
      text: ''
    };
  }

  showTooltip(event, data, point) {
    this.setState({
      point: point,
      text: parseInt(data * 100) + '%'
    });
  }

  render() {
    const { data, color } = this.props;
    const { point, text } = this.state;

    return (
      <Sparklines data={data}>
        <SparklinesLine color={color} onMouseMove={this.showTooltip.bind(this)}/>
        <SparklinesText point={point} fontSize={5} text={text} />
      </Sparklines>
    )
  }
}

module.exports = CoverageChart;
