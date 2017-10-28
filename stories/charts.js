import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs, color, boolean, number, array } from '@storybook/addon-knobs';

import PieChart from '../src/lib/chart/pie';
import LineChart from '../src/lib/chart/line';

storiesOf('PieChart', module)
  .addDecorator(withKnobs)
  .add('with basic options', () => {
      return (<PieChart
          data={ [5, 12, 8, 3, 10] }
          radius={ 150 }
          hole={ 50 }
          colors={ ['#43A19E', '#7B43A1', '#F2317A', '#FF9824', '#58CF6C'] }
          labels={ true }
          percent={ true }
          strokeWidth={ 3 }
          stroke={ '#fff' }
      />);
  })
  .add('with custom options', () => {
      let data = array('data', [5, 12, 8, 3, 10]);
      let radius = number('radius', 150);
      let hole = number('hole', 50);
      let colors = array('colors', ['#43A19E', '#7B43A1', '#F2317A', '#FF9824', '#58CF6C']);
      let labels = boolean('labels', true);
      let percent = boolean('percent', true);
      let strokeWidth = number('strokeWidth', 3);
      let stroke = color('stroke', '#fff');

      data = data.map((d) => {
          return parseInt(d);
      });

      return (<PieChart
          data={ data }
          radius={ radius }
          hole={ hole }
          colors={ colors }
          labels={ labels }
          percent={ percent }
          strokeWidth={ strokeWidth }
          stroke={ stroke }
      />);
  });

let opt = {
  data: [[97,92,89,30,72],[43,62,84,98,3],[23,88,52,14,4],[76,9,1,67,84]],
  axis: ['October', 'November', 'December', 'January', 'February'],
  width: 400,
  height: 400,
  colors: ['#7B43A1', '#F2317A', '#FF9824', '#58CF6C'],
  labels: ['Cats', 'Dogs', 'Ducks', 'Cows']
};

storiesOf('LineChart', module)
  .addDecorator(withKnobs)
  .add('with area', () => (
    <LineChart {...opt} area={ true } lines = { false } />
  ))
  .add('with lines', () => (
    <LineChart {...opt} dots={ true } lines={ true } />
  ))
  .add('with tooltips', () => (
    <LineChart {...opt} width={ 600 } height={ 50 } stroke={ 2 } radius={ 6 } dots={ true } grid={ false } hideLabels={ true } />
  ))
  .add('with custom options', () => {
    let axis = array('axis', opt.axis);
    let width = number('width', 400);
    let height = number('height', 400);
    let dots = boolean('dots', true);
    let area = boolean('area', true);
    let colors = array('colors', ['#7B43A1', '#F2317A', '#FF9824', '#58CF6C']);
    let labels = array('label', ['Cats', 'Dogs', 'Ducks', 'Cows']);
    let hideLabels = boolean('hideLabels', false);
    let maxValue = number('maxValue', 0);
    let heightRatio = number('heightRatio', 1);
    let padding = number('padding', 0);
    let grid = boolean('grid', true);
    let stroke = number('stroke', 1);
    let radius = number('radius', 3);

    return (<LineChart
        data={opt.data}
        dots={dots}
        axis={axis}
        area={area}
        width={width}
        height={height}
        colors={colors}
        labels={labels}
        hideLabels={hideLabels}
        maxValue={maxValue}
        heightRatio={heightRatio}
        padding={padding}
        grid={grid}
        stroke={stroke}
        radius={radius}
    />);
  });
