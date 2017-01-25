import React from 'react';

const XAxis = React.createClass({
	render: function () {
		var padding = this.props.padding,
						lines = [1, 2, 3],
						segment = this.props.height / 4,
						maxValue = ~~(this.props.maxValue / 4)

		return (
			<g>
				{ lines.map((l, li) => {
					var y = ~~(l * segment + padding) + .5
					return (
					<g>
						<line
							x1={ padding } y1={ y }
							x2={ this.props.width + padding } y2={ y }
							stroke="#eaeaea"
							strokeWidth="1px"
						/>

						<text className="LineChart--axis" x={ padding - 10 } y={ y + 2 } textAnchor="end">{ maxValue * (3 - li) }</text>

					</g>
				)})}

			</g>
		)
	}
})

const YAxis = React.createClass({
	render: function () {
		var padding = this.props.padding,
						lines = [0, 1, 2, 3, 4],
						segment = this.props.width / 4,
						height = this.props.height + padding,
						axis = this.props.axis

		return (
			<g>
				{ lines.map((l, li) => {
					var x = ~~(li * segment + padding) + .5
					return (
						<g>
							<line
								x1={ x } y1={ padding }
								x2={ x } y2={ height }
								stroke="#eaeaea" strokeWidth="1px"
							/>
							<text className="LineChart--axis" x={ x } y={ height + 15 } textAnchor="middle">
								{ axis[li % axis.length] }
							</text>

						</g>
					)
				})}

			</g>
		)
	}
})

module.exports = {
  XAxis,
  YAxis
}
