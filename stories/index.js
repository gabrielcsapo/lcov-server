import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { withKnobs, text, boolean, number, array } from '@kadira/storybook-addon-knobs';

import Chart from '../src/lib/chart';

const opt = {
  data: [[97,92,89,30,72],[43,62,84,98,3],[23,88,52,14,4],[76,9,1,67,84]],
  axis: ['October', 'November', 'December', 'January', 'February', 'Marsh'],
  width: 400,
  height: 400,
  colors: ['#7B43A1', '#F2317A', '#FF9824', '#58CF6C'],
  labels: ['Cats', 'Dogs', 'Ducks', 'Cows']
};

const handleChange = function(e) {
  opt[e.target.name] = e.target.value;

}

const stories = storiesOf('Chart', module);
stories.addDecorator(withKnobs);

stories
  .add('with area', () => (
    <Chart {...opt} area={ true } lines = { false } />
  ))
  .add('with lines', () => (
    <Chart {...opt} dots={ true } lines={ true } />
  ))
  .add('with tooltips', () => (
    <Chart {...opt} width={ 600 } height={ 50 } stroke={ 2 } radius={ 6 } dots={ true } grid={ false } hideLabels={ true } />
  ))
  .add('with custom options', () => {
    const axis = array('axis', opt.axis);
    const width = number('width', 400);
    const height = number('height', 400);
    const dots = boolean('dots', true);
    const colors = array('colors', ['#7B43A1', '#F2317A', '#FF9824', '#58CF6C']);
    const labels = array('label', ['Cats', 'Dogs', 'Ducks', 'Cows']);
    const hideLabels = boolean('hideLabels', false);
    const maxValue = number('maxValue', 0);
    const heightRatio = number('heightRatio', 1);
    const padding = number('padding', 0);
    const grid = boolean('grid', true);
    const stroke = number('stroke', 1);
    const radius = number('radius', 3);

    return (<Chart
        data={opt.data}
        dots={dots}
        axis={axis}
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
