import React from 'react';
import PropTypes from 'prop-types';

class Table extends React.Component {
  constructor(props) {
    super(props);

    const { data, chunk } = props;

    this.state = {
      data: data.slice(0,(data.length+chunk-1)/chunk|0).map(function(c,i) { return data.slice(chunk*i, chunk*i+chunk); }),
      page: 1
    };
  }
  nextPage() {
    const { page, data } = this.state;

    this.setState({
      page: (page + 1) > data.length ? 1 : page + 1
    });
  }

  previousPage() {
    const { page } = this.state;

    this.setState({
      page: (page - 1) < 1 ? 1 : page - 1
    });
  }

  render() {
    const { data, page } = this.state;

    return (<div>
      <table className="table responsive">
        <thead>
          <tr>
              { Object.keys(data[page -1][0]).map((k) => {
                return <th key={k}>{k}</th>;
              })}
          </tr>
        </thead>
        <tbody>
        {  data[page - 1].map((h, i) => {
          return (<tr key={`${page}/${i}`}>
              { Object.keys(h).map((k) => {
                return <td key={`${k}/${i}`}> <div className={ k === 'Commit' ? 'coverage-commit-message' : ''}>{ h[k] }</div> </td>;
              })}
          </tr>);
        }, []) }
        </tbody>
      </table>
      { data.length > 1 ?
        <div style={{ position: "relative", width: "80%", height: "50px", textAlign: "center", margin: "0 auto", marginBottom: "50px", lineHeight: "100px" }}>
          <button className="btn" style={{ left: 0, position: "absolute", top: "25px" }} onClick={this.previousPage.bind(this)}> Previous </button>

          <div style={{ display: "inline-block" }}> {page}/{data.length} </div>

          <button className="btn" style={{ right: 0, position: "absolute", top: "25px" }} onClick={this.nextPage.bind(this)}> Next </button>
        </div>
      : '' }
    </div>);
  }
}

Table.propTypes = {
  data: PropTypes.array,
  chunk: PropTypes.number
};

Table.defaultProps = {
  data: [],
  chunk: 5
};

export default Table;
