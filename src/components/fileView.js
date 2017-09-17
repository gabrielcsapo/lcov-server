import React from 'react';
import PropTypes from 'prop-types';

class FileView extends React.Component {
  render() {
    const { source, lineMap } = this.props;

    return (<div style={{ paddingTop: '25px', paddingBottom: '25px', backgroundColor: 'rgba(246, 244, 244, 0.5)', width: window.innerWidth - 200, margin:'0 auto', fontSize: "16px" }}>
      <table className="table responsive">
        <tbody>
          {source.replace(/ /g, '\u00a0').split('\n').map((l, i) => {
              if(l.length > 0) {
                  return (<tr>
                    <td style={{ padding: "2px", paddingRight: "5px", borderBottom: 0, textAlign: "center" }}>{ i }</td>
                    <td style={{ padding: "2px", borderBottom: 0 }}>{ l }</td>
                    <td style={{ padding: "2px", borderBottom: 0, color: lineMap[i] > 0 ? 'rgb(208, 233, 153)' : 'rgb(233, 179, 153)' }}>{ lineMap[i] || 0 }x</td>
                  </tr>);
              }
          }, [])}
        </tbody>
      </table>
    </div>);
  }
}

FileView.propTypes = {
  source: PropTypes.string,
  lineMap: PropTypes.array
};

export default FileView;
