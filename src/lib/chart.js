import React from 'react';

var opt = {
  data: [[97,92,89,30,72],[43,62,84,98,3],[23,88,52,14,4],[76,9,1,67,84]],
  colors: ['#7B43A1', '#F2317A', '#FF9824', '#58CF6C'],
  labels: ['Cats', 'Dogs', 'Ducks', 'Cows'],
	 axis: ['October', 'November', 'December', 'January', 'February', 'Marsh'],
}

/**
 * <LineChart {...opt} area={ true } />
 * <LineChart {...opt} dots={ true } lines={ true } />
 * <LineChart {...opt} width={ 600 } height={ 50 } stroke={ 2 } radius={ 6 } dots={ true } grid={ false } hideLabels={ true } />
 */

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
		setTimeout(() =>
			this.setState({ updating: false }), 300)
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
		var { data, lines, area, dots, stroke, radius, grid, axis } = this.props,
						width = this.props.width || 400,
						height = this.props.height || width * (9 / 16),
						colors = this.props.colors || ['#aaa', '#888'],
						labels = this.props.labels || [],
						hideLabels = this.props.hideLabels || false,
						size = data[0].length - 1,
						maxValue = 0,
						heightRatio = 1,
						padding = this.props.padding || 50,
						dataSet = [],
						grid = typeof grid !== 'undefined' ? grid : true,
						stroke = stroke || 1,
						radius = radius || 3


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
})




const Tooltip = React.createClass({
	render: function () {
		var { value, label, x, y, color } = this.props,
						style

		style = {
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




const Curve = React.createClass({
	render: function () {
		var { points, dataSetIndex, width, height, padding, lines, area, dots, color, stroke, updating } = this.props,
					path = [], areaPath = [],	style, fn

		fn = lines === true ? 'L' : 'R'
		height += padding
		style = {	pointerEvents: 'none' }

		if (updating === true) {
			style['opacity'] = 0
			style['transition'] = 'none'
		}

		path = points.map((p, pi) => (pi === 0  ? '' : (pi === 1 ? fn : '')) + p[0] + ',' + p[1]);
		path = 'M' + path.join(' ')

		if (lines !== true) {
			path = parsePath(path, height).join(' ')
		}


		if (area === true) {
			areaPath = path.replace('M', 'L')
			areaPath = 'M' + padding + ',' + height + areaPath
			areaPath += 'L' + (width + padding) + ',' + height
		}

		return (
			<g style={ style }>
				{ area === true ? <path d={ areaPath } fill={ color } fillOpacity=".05" /> : null }
				<path d={ path } fill="none" stroke={ color } strokeWidth={ stroke } />
			</g>
		)
	}
})




const Point = React.createClass({
	mouseEnter: function () {
		this.props.showTooltip(this.props.point, this.props.dataSetIndex, this.props.index)
	},
	mouseLeave: function () {
		this.props.hideTooltip()
	},
	render: function () {
			var { point, stroke, radius } = this.props,
				x = point[0],
				y = point[1],
				color = point[3]

		return <circle
			cx={ x } cy={ y }
			r={ radius } fill={ color }
			strokeWidth={ stroke } stroke={ '#ffffff' }
			onMouseEnter={ this.mouseEnter } onMouseLeave={ this.mouseLeave } />
	}
})




function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Catmull-Rom to Bezier found here: http://jsdo.it/ynakajima/catmullrom2bezier
// Whoever wrote this is AWESOME! Thank you!
function parsePath(d, maxHeight) {
  var pathArray = [], lastX = '', lastY = ''

  if ( -1 != d.search(/[rR]/) ) {
    // no need to redraw the path if no Catmull-Rom segments are found

    // split path into constituent segments
    var pathSplit = d.split(/([A-Za-z])/);
    for (var i = 0, iLen = pathSplit.length; iLen > i; i++) {
      var segment = pathSplit[i];

      // make command code lower case, for easier matching
      // NOTE: this code assumes absolution coordinates, and doesn't account for relative command coordinates
      var command = segment.toLowerCase()
      if ( -1 != segment.search(/[A-Za-z]/) ) {
        var val = "";
        if ( "z" != command ) {
          i++;
          val = pathSplit[ i ].replace(/\s+$/, '');
        }

        if ( "r" == command ) {
          // "R" and "r" are the a Catmull-Rom spline segment

          var points = lastX + "," + lastY + " " + val;

          // convert Catmull-Rom spline to Bézier curves
          var beziers = catmullRom2bezier( points, maxHeight );
          //insert replacement curves back into array of path segments
          pathArray.push( beziers );
        } else {
          // rejoin the command code and the numerical values, place in array of path segments
          pathArray.push( segment + val );

          // find last x,y points, for feeding into Catmull-Rom conversion algorithm
          if ( "h" == command ) {
            lastX = val;
          } else if ( "v" == command ) {
            lastY = val;
          } else if ( "z" != command ) {
            var c = val.split(/[,\s]/);
            lastY = c.pop();
            lastX = c.pop();
          }
        }
      }
    }
    // recombine path segments and set new path description in DOM
  }

	return pathArray
}

function catmullRom2bezier( points, maxHeight ) {
  var crp = points.split(/[,\s]/);

  var d = "";
  for (var i = 0, iLen = crp.length; iLen - 2 > i; i+=2) {
    var p = [];
    if ( 0 == i ) {
      p.push( {x: parseFloat(crp[ i ]), y: parseFloat(crp[ i + 1 ])} );
      p.push( {x: parseFloat(crp[ i ]), y: parseFloat(crp[ i + 1 ])} );
      p.push( {x: parseFloat(crp[ i + 2 ]), y: parseFloat(crp[ i + 3 ])} );
      p.push( {x: parseFloat(crp[ i + 4 ]), y: parseFloat(crp[ i + 5 ])} );
    } else if ( iLen - 4 == i ) {
      p.push( {x: parseFloat(crp[ i - 2 ]), y: parseFloat(crp[ i - 1 ])} );
      p.push( {x: parseFloat(crp[ i ]), y: parseFloat(crp[ i + 1 ])} );
      p.push( {x: parseFloat(crp[ i + 2 ]), y: parseFloat(crp[ i + 3 ])} );
      p.push( {x: parseFloat(crp[ i + 2 ]), y: parseFloat(crp[ i + 3 ])} );
    } else {
      p.push( {x: parseFloat(crp[ i - 2 ]), y: parseFloat(crp[ i - 1 ])} );
      p.push( {x: parseFloat(crp[ i ]), y: parseFloat(crp[ i + 1 ])} );
      p.push( {x: parseFloat(crp[ i + 2 ]), y: parseFloat(crp[ i + 3 ])} );
      p.push( {x: parseFloat(crp[ i + 4 ]), y: parseFloat(crp[ i + 5 ])} );
    }

    // Catmull-Rom to Cubic Bezier conversion matrix
    //    0       1       0       0
    //  -1/6      1      1/6      0
    //    0      1/6      1     -1/6
    //    0       0       1       0

    var bp = [];
    bp.push( { x: p[1].x,  y: p[1].y } );
    bp.push( { x: ((-p[0].x + 6*p[1].x + p[2].x) / 6), y: ((-p[0].y + 6*p[1].y + p[2].y) / 6)} );
    bp.push( { x: ((p[1].x + 6*p[2].x - p[3].x) / 6),  y: ((p[1].y + 6*p[2].y - p[3].y) / 6) } );
    bp.push( { x: p[2].x,  y: p[2].y } );

			bp = bp.map(_ => {
				if (_.y > maxHeight) {
					_.y = maxHeight
				}

				return _
			})

    d += "C" + bp[1].x + "," + bp[1].y + " " + bp[2].x + "," + bp[2].y + " " + bp[3].x + "," + bp[3].y + " ";
  }

  return d;
}

module.exports = LineChart;
