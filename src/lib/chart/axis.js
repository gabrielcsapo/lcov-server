import React from 'react';

const XAxis = React.createClass({
  propTypes: {
    padding: React.PropTypes.number,
    height: React.PropTypes.number,
    width: React.PropTypes.number,
    maxValue: React.PropTypes.number,
  },

  defaultProps: {
    padding: 0,
    height: 0,
    width: 0,
    maxValue: 0
  },

	render() {
		let { padding, height, width, maxValue } = this.props;
		let segment = height / 4;
		let lines = [1, 2, 3];

		maxValue = ~~(maxValue / 4);

		return (<g>
			{lines.map((l, li) => {
				const y = ~~(l * segment + padding) + .5;
				return (<g>
						<line
							x1={ padding }
							y1={ y }
							x2={ width + padding }
							y2={ y }
							stroke="#eaeaea"
							strokeWidth="1px"
						/>

            <text className="LineChart--axis"
              x={ padding - 10 }
              y={ y + 2 }
              textAnchor={ "end" }
            >
              { maxValue * (3 - li) }
            </text>

					</g>);
			})}
		</g>);
	}
});

const YAxis = React.createClass({
  propTypes: {
    padding: React.PropTypes.number,
    height: React.PropTypes.number,
    width: React.PropTypes.number,
    axis: React.PropTypes.array
  },

  defaultProps: {
    padding: 0,
    height: 0,
    width: 0,
    axis: []
  },

	render() {
    let { axis, padding, height, width } = this.props;
    let lines = [0, 1, 2, 3, 4];
    let segment = width / 4;
		height = height + padding;

		return (<g>
			{lines.map((l, li) => {
				var x = ~~(li * segment + padding) + .5;
				return (<g>
					<line
						x1={ x } y1={ padding }
						x2={ x } y2={ height }
						stroke="#eaeaea" strokeWidth="1px"
					/>
					<text className="LineChart--axis" x={ x } y={ height + 15 } textAnchor="middle">
						{ axis[li % axis.length] }
					</text>

				</g>);
			})}
		</g>);
	}
});

module.exports = {
  YAxis,
  XAxis
};
