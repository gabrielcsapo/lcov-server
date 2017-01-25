import React from 'react';

const Point = React.createClass({
	mouseEnter: function () {
		this.props.showTooltip(this.props.point, this.props.dataSetIndex, this.props.index)
	},
	mouseLeave: function () {
		this.props.hideTooltip()
	},
	render: function () {
			const { point, stroke, radius } = this.props;
			const x = point[0];
			const y = point[1];
			const color = point[3];

		return <circle
			cx={ x }
      cy={ y }
			r={ radius }
      fill={ color }
			strokeWidth={ stroke }
      stroke={ '#ffffff' }
			onMouseEnter={ this.mouseEnter }
      onMouseLeave={ this.mouseLeave }
    />
	}
})

const Points = React.createClass({
	render: function () {
		var { points, dataSetIndex, showTooltip, hideTooltip, radius, stroke, label, dots, hideLabels } = this.props,
				lastPoint = points[points.length - 1],
				color = lastPoint[3],
				x = lastPoint[0],
				y = lastPoint[1]

		return (
			<g>
				{ dots === true ?
				points.map((p, pi) =>
					<Point
				 		point={ p }
						dataSetIndex={ dataSetIndex }
						showTooltip={ showTooltip }
						hideTooltip={ hideTooltip }
						stroke={ stroke }
						radius={ radius }
						index={ pi }
						key={ pi }
					/>)
				: null }

				{ hideLabels !== true ?
					<text className="LineChart--label" x={ x + 5 } y={ y + 2 } fill={ color }>{ label }</text>
				: null }
			</g>
		)
	}
})

module.exports = {
  Points,
  Point
};
