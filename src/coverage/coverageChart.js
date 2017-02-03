import 'whatwg-fetch';

import React from 'react';
import { LineChart } from '../lib/chart';

class CoverageChart extends React.Component {
  render() {
    const { data, height, width } = this.props;

    const opt = {
        data,
        colors: ['#9a8585', '#a7daff', '#f7ca97'],
        labels: ['Lines', 'Branches', 'Functions'],
        width,
        height,
        lines: true,
        area: true,
        dots: true,
        hideLabels: false,
        grid: false
    };

    return (
      <LineChart {...opt} />
    )
  }
}

module.exports = CoverageChart;
