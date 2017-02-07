import React from 'react';

const Tooltip = React.createClass({
  propTypes: {
    value: React.PropTypes.number,
    label: React.PropTypes.string,
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    color: React.PropTypes.string
  },

  defaultProps: {
    value: 0,
    label: '',
    x: 0,
    y: 0,
    color: ''
  },

  render() {
		const { value, label, x, y, color } = this.props;
    const style = {
			left: ~~x,
			top: ~~y
		};

		return (
			<span className="LineChart--tooltip" style={ style }>
					<b style={{ color: color }}>{ label }</b>
					<i>{ value }</i>
			</span>
		);
	}
});

module.exports = {
  Tooltip
};
