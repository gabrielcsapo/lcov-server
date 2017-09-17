import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs, color, boolean, number, array } from '@storybook/addon-knobs';

import PieChart from '../src/lib/chart/pie';

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
