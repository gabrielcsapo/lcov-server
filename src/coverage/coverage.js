import 'whatwg-fetch';

import React from 'react';
import ReactDOM from 'react-dom';
import CoverageChart from './coverageChart';
import moment from 'moment';

class Coverage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coverages: [],
      error: ''
    };
  }

  componentDidMount() {
    fetch('/api/v1/coverage')
      .then((response) => {
        return response.json();
      }).then((coverages) => {
        this.setState({
          coverages: coverages
        });
      }).catch((ex) => {
        this.setState({
          error: ex.toString()
        });
      });
  }

  render() {
    const { coverages, error, point, text } = this.state;
    if(error) {
        return (<div className="text-center" style={{width:"100%",position: "absolute",top: "50%",transform: "translateY(-50%)"}}>
          Oh no 🙈 something happened...
        </div>);
    } else if(coverages.length > 0) {
      return (<div>
        {coverages.map((coverage) => {
            const url = coverage._id;
            const data = coverage.history.map(function(history) {
              const { lines } = history.source_files[0];
              return lines.hit / lines.found;
            }, []);
            const percentage = parseInt(data[data.length - 1] * 100);
            const owner = url.split('/')[url.split('/').length - 2];
            const repo = url.split('/')[url.split('/').length - 1].replace('.git', '');
            const { message, commit, branch, author_name, author_date } = coverage.history[coverage.history.length - 1].git;
            const color = percentage >= 90 ? '#008a44' : percentage <= 89 && percentage >= 80 ? '#cfaf2a' : '#c75151';
            const commitUrl = url.replace('.git', `/commit/${commit}`);

            return (<div style={{marginBottom: '50px'}}>
               <div style={{marginLeft: '50px', marginRight: '50px'}}>
                <div style={{float: 'left', textAlign: 'left'}}>
                    <h3> {owner} / {repo} </h3>
                    <p>
                      <a href={commitUrl} target="_blank"> {message} </a>
                      on branch
                      <b> {branch} </b>
                      {moment(author_date * 1000).fromNow()}
                      &nbsp;by
                      <b> {author_name} </b>
                    </p>
                </div>

                <h3 style={{float: 'right', color: color}}>{percentage}%</h3>
               </div>
               <CoverageChart data={data} color={color} />
            </div>);
        })}
      </div>);
    } else {
      return (<div className="text-center" style={{width:"100%",position: "absolute",top: "50%",transform: "translateY(-50%)"}}>
        No Coverage 🌧
      </div>);
    }
  }
}

export default Coverage;
