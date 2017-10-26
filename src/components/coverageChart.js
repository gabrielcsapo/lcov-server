import React from 'react';
import PropTypes from 'prop-types';

import LineChart from '../lib/chart/line';

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
    );
  }
}

CoverageChart.propTypes = {
  data: PropTypes.array,
  height: PropTypes.number,
  width: PropTypes.number
};

export default CoverageChart;
