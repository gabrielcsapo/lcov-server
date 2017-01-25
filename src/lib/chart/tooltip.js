import React from 'react';

const Tooltip = React.createClass({
	render: function () {
		const { value, label, x, y, color } = this.props;
    const style = {
			left: ~~x,
			top: ~~y
		}

		return (
			<span className="LineChart--tooltip" style={ style }>
					<b style={{ color: color }}>{ label }</b>
					<i>{ value }</i>
			</span>
		)
	}
})

module.exports = {
  Tooltip
};
