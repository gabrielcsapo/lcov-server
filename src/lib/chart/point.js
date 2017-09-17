import React from 'react';
import PropTypes from 'prop-types';

class Point extends React.Component {
	constructor(props) {
		super(props);
	}
	mouseEnter() {
		let { radius, point, dataSetIndex, index } = this.props;

		this.props.showTooltip([point[0] + radius * 3, point[1] + radius * 3], dataSetIndex, index);
	}
	mouseLeave() {
		this.props.hideTooltip();
	}
	render() {
    let { point, stroke, radius } = this.props;
    let x = point[0];
    let y = point[1];
    let color = point[3];

		return (<circle
			cx={ x }
      cy={ y }
			r={ radius }
      fill={ color }
			strokeWidth={ stroke }
      stroke={ '#ffffff' }
			onMouseEnter={ this.mouseEnter.bind(this) }
      onMouseLeave={ this.mouseLeave.bind(this) }
    />);
	}
}

Point.propTypes = {
  point: PropTypes.array,
  stroke: PropTypes.string,
  radius: PropTypes.number,
  index: PropTypes.number,
  dataSetIndex: PropTypes.number,
  showTooltip: PropTypes.func,
  hideTooltip: PropTypes.func
};

Point.defaultProps = {
  point: [],
  stroke: '#fff',
  radius: 0,
  index: 0,
  dataSetIndex: 0,
  showTooltip: () => {},
  hideTooltip: () => {}
};

export default Point;
