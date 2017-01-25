import React from 'react';
import './style.css'

import { Curve } from './curve';
import { XAxis, YAxis } from './axis';
import { Points, Point } from './points';
import { Tooltip } from './tooltip';

const LineChart = React.createClass({
	getInitialState: function () {
		return {
			tooltip: false,
			value: '',
			dataSet: 0,
			index: 0,
			x: 0,
			y: 0,
			color: ''
		}
	},

	componentWillReceiveProps: function () {
		this.setState({ updating: true }, this.endUpdate)
	},

	endUpdate: function () {
		setTimeout(() => {
        this.setState({ updating: false });
    }, 300)
	},

	showTooltip: function (point, dataSetIndex, index) {
		this.setState({
			updating: false,
			tooltip: true,
			value: point[2],
			dataSet: dataSetIndex,
			index: index,
			x: point[0],
			y: point[1],
			color: point[3]
		})
	},

	hideTooltip: function () {
		this.setState(this.getInitialState())
	},

	render: function () {
		let {
      data,
      lines,
      area,
      dots,
      stroke,
      radius,
      grid,
      axis,
      width,
      height,
      colors,
      labels,
      hideLabels,
      maxValue,
      heightRatio,
      padding
    } = this.props;
    let dataSet = [];
    const size = data[0].length - 1;

    width = width || 400;
		height = height || width * (9 / 16);
		colors = colors || ['#aaa', '#888'];
		labels = labels || [];
		hideLabels = hideLabels || false;
		maxValue = maxValue || 0;
		heightRatio = heightRatio || 1;
		padding = padding || 50;
		grid = typeof grid === 'undefined' ? true : grid;
		stroke = stroke || 1;
		radius = radius || 3;

  	// Calculate the maxValue
  	dataSet = data.forEach(pts => {
  		var max = Math.max.apply(null, pts)
  		maxValue =	max > maxValue ? max : maxValue
  	})

  	// Y ratio
   	if (maxValue === 0) {
  		heightRatio = 1
  	} else {
  		heightRatio = height / maxValue
  	}

		// Calculate the coordinates
  	dataSet = data.map((pts, di) =>
  		pts.map((pt, pi) => [
  					~~((width / size) * pi + padding) + .5, // x
  					~~((heightRatio) * (maxValue - pt) + padding) + .5, // y
  					pt, // value
  					colors[di % colors.length] // color
  				]
  	))

  	return (
  			<span className="LineChart" style={{ width: width + 2*padding }}>
  				<svg xmlns="http://www.w3.org/2000/svg"
  								width={ (width + padding * 2) + 'px' }
  								height={ (height + 2*padding) + 'px' }
  								viewBox={ '0 0 ' + (width + 2*padding) + ' ' + (height + 2*padding) }
  				>
  					{ grid ?
  						<g>
  							<XAxis maxValue={ maxValue } padding={ padding } width={ width } height={ height } />
  							<YAxis axis={ axis } padding={ padding } width={ width } height={ height } />
  						</g>
  					: null }

  					{ dataSet.map((p, pi) =>
  						<g key={ pi }>
  							<Curve
  								points={ p }
  								dataSetIndex={ pi }
  								lines={ lines }
  								area={ area }
  								width={ width }
  								height={ height }
  								padding={ padding }
  								color={ colors[pi % colors.length] }
  								updating={ this.state.updating }
  								stroke={ stroke }
  							/>


  							<Points hideLabels={ hideLabels } dots={ dots } label={ labels[pi] } points={ p } dataSetIndex={ pi } showTooltip={ this.showTooltip } hideTooltip={ this.hideTooltip } stroke={ stroke } radius={ radius } />

  						</g>
  					)}

  				</svg>

  				{ this.state.tooltip ?
  					<Tooltip
  						value={ this.state.value }
  						label={ labels[this.state.dataSet] }
  						x={ this.state.x }
  						y={ this.state.y - 15 }
  						color={ this.state.color }
  					/>
  				: null }
  			</span>
  		)
	}
});

module.exports = LineChart;
