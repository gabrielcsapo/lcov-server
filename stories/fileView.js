import React from 'react';

import { storiesOf } from '@storybook/react';

import FileView from '../src/components/fileView';

storiesOf('FileView', module)
  .add('basic javascript file', () => {
    const file = `
      import React from 'react';
      import PropTypes from 'prop-types';

      class Error extends React.Component {
        render() {
          const { error } = this.props;

          return (<div className="text-center" style={{width:"100%",position: "absolute",top: "50%",transform: "translateY(-50%)"}}>
            Oh no 🙈 something happened...
            <br/>
            <br/>
            <pre style={{width: '50%', margin: '0 auto'}}>
              { error || 'Page not found' }
            </pre>
          </div>);
        }
      }

      Error.propTypes = {
        error: PropTypes.string
      };

      export default Error;
    `;
    return <FileView source={file} lineMap={[1, 6, 0, 7, 3, 6, 7, 8, 9]} />;
  });
