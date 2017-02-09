import 'whatwg-fetch';

import React from 'react';
import CoverageChart from './coverageChart';
import moment from 'moment';

import './style.css';

class Coverages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coverages: [],
      error: '',
      title: '',
      loading: true
    };
  }

  componentDidMount() {
    const { service, owner } = this.props.params;
    let url = '/api/v1/coverage'; // Fetches all the coverage saved on the server
    // filters the coverages to only show the ones that are based on this service and owner
    if(service && owner) {
      url = `/api/v1/coverage/${service}/${owner}`
      this.setState({
        title: `showing coverage reports for ${owner} on ${service}`
      });
    }
    fetch(url)
      .then((response) => {
        return response.json();
      }).then((coverages) => {
        this.setState({
          coverages: coverages,
          loading: false
        });
      }).catch((ex) => {
        this.setState({
          error: ex.toString(),
          loading: false
        });
      });
  }

  render() {
    const { coverages, title, loading, error } = this.state;

    if(loading) {
      return (<div className="text-center" style={{width:"100%",position: "absolute",top: "50%",transform: "translateY(-50%)"}}>
        Loading 🌪
      </div>);
    } else if(error) {
        return (<div className="text-center" style={{width:"100%",position: "absolute",top: "50%",transform: "translateY(-50%)"}}>
          Oh no 🙈 something happened...
          <br/>
          <br/>
          <pre style={{width: '50%', margin: '0 auto'}}>
            {error}
          </pre>
        </div>);
    } else if(coverages.length > 0) {
      return (<div>
        { title ?
          <div className="text-center">
            <br/>
            <i> { title } </i>
          </div>
        : null}
        {coverages.map((coverage) => {
            const url = coverage._id;
            const urlParts = url.split('/');
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
            let service, owner, repo = '';
            const percentage = parseInt(data[0][data[0].length - 1]);
            if(urlParts.length == 2) {
              service = urlParts[0].substring(urlParts[0].indexOf('@') + 1, urlParts[0].indexOf(':')).replace('.org', '').replace('.com', '');
              owner = urlParts[0].substring(urlParts[0].indexOf(':') + 1, urlParts[0].length)
              repo = urlParts[1].replace('.git', '');
            } else {
              service = urlParts[urlParts.length - 3].replace('.org', '').replace('.com', '');
              owner = urlParts[urlParts.length - 2];
              repo = urlParts[urlParts.length - 1].replace('.git', '');
            }
            const { message, commit, branch, author_name, author_date } = coverage.history[coverage.history.length - 1].git;
            const color = percentage >= 90 ? '#008a44' : percentage <= 89 && percentage >= 80 ? '#cfaf2a' : '#c75151';
            const commitUrl = url.replace('.git', `/commit/${commit}`);

            return (<div className="coverage">
              <div className="coverage_header">
                 <div style={{display: 'inline-block', width: '100%'}}>
                   <div style={{float: 'left', textAlign: 'left'}}>
                       <h3> <a href={`/coverage/${service}/${owner}/`}>{owner}</a> / <a href={`/coverage/${service}/${owner}/${repo}`}>{repo}</a> </h3>
                       <p>
                         <a className="coverage_commit_message" href={commitUrl} target="_blank"> {message} </a>
                         on branch
                         <b> {branch} </b>
                         {moment(author_date * 1000).fromNow()}
                         &nbsp;by
                         <b> {author_name} </b>
                       </p>
                   </div>

                   <h3 style={{float: 'right', color: color}}>{percentage}%</h3>
                 </div>
                 <CoverageChart width={window.innerWidth - 200} data={data} height={100} />
              </div>
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
