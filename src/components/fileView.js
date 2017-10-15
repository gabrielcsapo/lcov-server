import 'highlight.js/styles/default.css';

import React from 'react';
import PropTypes from 'prop-types';
import Highlight from 'highlight.js';

class FileView extends React.Component {
  render() {
    const { source, lineMap, extension } = this.props;

    return (<div style={{ paddingTop: '25px', paddingBottom: '25px', backgroundColor: 'rgba(246, 244, 244, 0.5)', width: window.innerWidth - 200, margin:'0 auto', fontSize: "16px" }}>
      <table className="table responsive">
        <tbody>
          {Highlight.highlight(extension, source).value.split('\n').map((l, i) => {
            // retain the amount of space that will be stripped
            const line = l.split('').reverse();
            const color = lineMap[i] > 0 ? '#00c661' : '#c75151';
            let space = '';
            while(line.pop() == ' ') {
              space += '\u00a0';
            }
            return (<tr key={i}>
              <td style={{ padding: "2px", paddingRight: "5px", borderBottom: 0, textAlign: "center" }}>{ i }</td>
              <td style={{ padding: "2px", borderBottom: 0 }} dangerouslySetInnerHTML={{ __html: space + l }}></td>
              <td style={{ padding: "2px", borderBottom: 0, color: color }}>{ !isNaN(lineMap[i]) ? `${lineMap[i]}x` : '' }</td>
            </tr>);
          }, [])}
        </tbody>
      </table>
    </div>);
  }
}

FileView.propTypes = {
  source: PropTypes.string,
  lineMap: PropTypes.array,
  extension: PropTypes.string
};

export default FileView;
