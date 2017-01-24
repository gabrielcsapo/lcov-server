import 'whatwg-fetch';

import React from 'react';
import ReactDOM from 'react-dom';
import CoverageChart from './coverageChart';
import moment from 'moment';

class Coverages extends React.Component {
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
    const { coverages, error } = this.state;
    if(error) {
        console.log(error);
        return (<div className="text-center" style={{width:"100%",position: "absolute",top: "50%",transform: "translateY(-50%)"}}>
          Oh no 🙈 something happened...
        </div>);
    } else if(coverages.length > 0) {
      return (<div>
        {coverages.map((coverage) => {
            const url = coverage._id;
            const data = [[], [], []];
            coverage.history.forEach(function(history) {
              const { lines, branches, functions } = history.source_files[0];
              data[0].push(parseInt((lines.hit / lines.found) * 100))
              data[1].push(parseInt((branches.hit / branches.found) * 100))
              data[2].push(parseInt((functions.hit / functions.found) * 100))
            }, []);
            // If there is only one data point
            // add another that is the same value to make a line
            if(data[0].length == 1) {
                data[0].push(data[0][0]);
                data[1].push(data[1][0]);
                data[2].push(data[2][0]);
            };

            const percentage = parseInt(data[0][data[0].length - 1]);
            const owner = url.split('/')[url.split('/').length - 2];
            const repo = url.split('/')[url.split('/').length - 1].replace('.git', '');
            const { message, commit, branch, author_name, author_date } = coverage.history[coverage.history.length - 1].git;
            const color = percentage >= 90 ? '#008a44' : percentage <= 89 && percentage >= 80 ? '#cfaf2a' : '#c75151';
            const commitUrl = url.replace('.git', `/commit/${commit}`);

            return (<div style={{marginBottom: '50px'}}>
               <div style={{paddingLeft: '2.5%', paddingRight: '2.5%', display: 'inline-block', width: '95%'}}>
                <div style={{float: 'left', textAlign: 'left'}}>
                    <h3> {owner} / <a href={`coverage/${encodeURIComponent(url).replace(/\./g, '%2E')}`}>{repo}</a> </h3>
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
               <CoverageChart data={data} height={150} width={window.innerWidth - 150} />
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

export default Coverages;
