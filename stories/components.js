import React from 'react';

import { storiesOf } from '@storybook/react';

import NoCoverage from '../src/components/noCoverage';
import Loading from '../src/components/loading';
import Error from '../src/components/error';
import Table from '../src/components/table';
import FileView from '../src/components/fileView';

storiesOf('NoCoverage', module)
  .add('basic', () => {
    return <div style={{ margin: '50px' }}>
      <NoCoverage/>
    </div>;
  });

storiesOf('Loading', module)
  .add('basic', () => {
    return <div style={{ margin: '50px' }}>
      <Loading/>
    </div>;
  });

storiesOf('Error', module)
  .add('default', () => {
    return <div style={{ margin: '50px' }}>
      <Error/>
    </div>;
  })
  .add('with error', () => {
    return <div style={{ margin: '50px' }}>
      <Error error={"Something has gone very wrong"}/>
    </div>;
  });

storiesOf('Table', module)
  .add('basic', () => {
    var data = [{
      "Sha": "5fa390",
      "Branch": "greenkeeper/tap-10.7.1",
      "Coverage": "100%",
      "Commit": "chore(package): update tap to version 10.7.1",
      "Committer": "greenkeeper[bot]",
      "Commit Time": "3 months ago",
      "Recieved": "3 months ago"
    }, {
      "Sha": "d04ecc",
      "Branch": "greenkeeper/tape-4.8.0",
      "Coverage": "100%",
      "Commit": "chore(package): update tape to version 4.8.0",
      "Committer": "greenkeeper[bot]",
      "Commit Time": "3 months ago",
      "Recieved": "3 months ago"
    }, {
      "Sha": "4f4ed4",
      "Branch": "greenkeeper/eslint-pin-4.2.0",
      "Coverage": "100%",
      "Commit": "chore: pin eslint to 4.2.0",
      "Committer": "greenkeeper[bot]",
      "Commit Time": "3 months ago",
      "Recieved": "3 months ago"
    }, {
      "Sha": "b6b18e",
      "Branch": "master",
      "Coverage": "100%",
      "Commit": "Merge 3f3798f66a1c45a25476a08391624398c641c2e7 into a2a690825930a7ec8c7926e69281074060795d1f",
      "Committer": "GitHub",
      "Commit Time": "3 months ago",
      "Recieved": "3 months ago"
    }, {
      "Sha": "3f3798",
      "Branch": "greenkeeper/tryitout-0.0.5",
      "Coverage": "100%",
      "Commit": "chore(package): update tryitout to version 0.0.5",
      "Committer": "greenkeeper[bot]",
      "Commit Time": "3 months ago",
      "Recieved": "3 months ago"
    }, {
      "Sha": "a2a690",
      "Branch": "master",
      "Coverage": "100%",
      "Commit": "chore(package): update eslint to version 4.3.0 (#25)",
      "Committer": "GitHub",
      "Commit Time": "3 months ago",
      "Recieved": "3 months ago"
    }, {
      "Sha": "c3e005",
      "Branch": "greenkeeper/eslint-4.3.0",
      "Coverage": "100%",
      "Commit": "chore(package): update eslint to version 4.3.0",
      "Committer": "greenkeeper[bot]",
      "Commit Time": "3 months ago",
      "Recieved": "3 months ago"
    }, {
      "Sha": "7ff2ed",
      "Branch": "master",
      "Coverage": "100%",
      "Commit": "chore(package): update tryitout to version 0.0.4 (#24)",
      "Committer": "Gabriel Csapo",
      "Commit Time": "3 months ago",
      "Recieved": "3 months ago"
    }];
    return <div style={{ margin: '50px' }}>
      <Table data={data} sort={"Recieved"} chunk={3}/>
    </div>;
  });

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
