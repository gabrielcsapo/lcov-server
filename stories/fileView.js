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
    return <FileView source={file} lineMap={[21,74,91,1,86,61,50,64,92,10,84,80,27,73,63,60,59,74,55,91,14,72,10,62,33]} extension={'js'} />;
  })
  .add('basic java file', () => {
    const file = `
      public class HelloWorld {

        public static void main(String[] args) {
            // Prints "Hello, World" to the terminal window.
            System.out.println("Hello, World");
        }

      }
    `;
    return <FileView source={file} lineMap={[1, 6, 0, 7, 3, 6, 9, 3, 9]} extension={'java'} />;
  });
