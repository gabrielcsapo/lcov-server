import 'whatwg-fetch';

import React from 'react';
import CoverageChart from './coverageChart';
import moment from 'moment';

import './style.css';

class Coverage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      loading: true
    };
  }

  componentDidMount() {
   const { source, owner, name } = this.props.match.params;

   fetch(`/api/v1/coverage/${source}/${owner}/${name}`)
     .then((response) => {
       return response.json();
     }).then((project) => {
       this.setState({
         project: project[0],
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
    const { project, error, loading } = this.state;
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
    } else if(project) {
        const { source, owner, name } = this.props.match.params;

        const history = project.history;
        const url = history[0]._id;
        const data = [[], [], []];
        history.forEach(function(history) {
          const { lines, branches, functions } = history.source_files[0];
          data[0].push(parseInt(((lines.hit / lines.found) || 1) * 100))
          data[1].push(parseInt(((branches.hit / branches.found) || 1) * 100))
          data[2].push(parseInt(((functions.hit / functions.found) || 1) * 100))
        }, []);
        // If there is only one data point
        // add another that is the same value to make a line
        if(data[0].length == 1) {
            data[0].push(data[0][0]);
            data[1].push(data[1][0]);
            data[2].push(data[2][0]);
        };

        const percentage = parseInt(data[0][data[0].length - 1]);
        const { message, commit, branch, author_name, author_date } = history[history.length - 1].git;
        const color = percentage >= 90 ? '#008a44' : percentage <= 89 && percentage >= 80 ? '#cfaf2a' : '#c75151';
        const commitUrl = url.replace('.git', `/commit/${commit}`);

        return (<div className="coverage">
           <div className="coverage_header">
            <div style={{display: 'inline-block', width: '100%'}}>
              <div style={{float: 'left', textAlign: 'left'}}>
                  <h3> <a href={`/coverage/${source.replace(/\./g, '%2E')}/${owner}/`}>{owner}</a> / <a href={`/coverage/${source.replace(/\./g, '%2E')}/${owner}/${name}`}>{name}</a> </h3>
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
            <hr/>
            <ul style={{listStyle: 'none', textAlign: 'center'}}>
               <li style={{lineHeight: '1.4', display: 'inline-block', margin: '5px', padding: '15px', backgroundColor: 'rgba(53, 74, 87, 0.05)'}}>
                   <div style={{marginBottom: '5px'}}> Last Build </div>
                   <div>
                       <b> { moment(history[history.length - 1].run_at).fromNow() } </b>
                   </div>
               </li>
               <li style={{lineHeight: '1.4', display: 'inline-block', margin: '5px', padding: '15px', backgroundColor: 'rgba(53, 74, 87, 0.05)'}}>
                   <div style={{marginBottom: '5px'}}> Total Files </div>
                   <div>
                       <b> { history[history.length - 1].source_files.length } </b>
                   </div>
               </li>
               <li style={{lineHeight: '1.4', display: 'inline-block', margin: '5px', padding: '15px', backgroundColor: 'rgba(53, 74, 87, 0.05)'}}>
                   <div style={{marginBottom: '5px'}}> Total Builds </div>
                   <div>
                       <b> { history.length } </b>
                   </div>
               </li>
               <li style={{display: 'inline-block', margin: '5px', padding: '15px', backgroundColor: 'rgba(53, 74, 87, 0.05)'}}>
                   <div style={{marginBottom: '5px'}}> Badge </div>
                   <div>
                       <img src={`/badge/${source.replace(/\./g, '%2E')}/${owner}/${name}.svg`} />
                   </div>
               </li>
            </ul>
            <hr/>
            <h4> Source Files </h4>
            <table className="table responsive">
              <thead>
                <tr>
                    <th>Coverage</th>
                    <th>File</th>
                    <th>Lines</th>
                    <th>Branches</th>
                    <th>Functions</th>
                </tr>
              </thead>
              <tbody>
              {history[0].source_files.map((f) => {
                  const totalFound = f.lines.found + f.branches.found + f.functions.found;
                  const totalHit = f.lines.hit + f.branches.hit + f.functions.hit;
                  const totalCoverage = parseInt((totalHit / totalFound) * 100);
                  const fileName = encodeURIComponent(f.title).replace(/\./g, '$2E');

                  return (<tr>
                      <td> { totalCoverage }% </td>
                      <td>
                          <a href={`/coverage/${source.replace(/\./g, '%2E')}/${owner}/${name}/${fileName}`}>
                              { f.title }
                          </a>
                      </td>
                      <td> { `${f.lines.hit} / ${f.lines.found}` }</td>
                      <td> { `${f.branches.hit} / ${f.branches.found}` }</td>
                      <td> { `${f.functions.hit} / ${f.functions.found}` }</td>
                  </tr>)
              })}
              </tbody>
            </table>
            <h4> Recent Builds </h4>
            <table className="table responsive">
              <tr>
                  <th>Branch</th>
                  <th>Coverage</th>
                  <th>Commit</th>
                  <th>Committer</th>
                  <th>Commit Time</th>
                  <th>Recieved</th>
              </tr>
              {history.map((h) => {
                  let totalCoverage = h.source_files.map((f) => {
                    const totalFound = f.lines.found + f.branches.found + f.functions.found;
                    const totalHit = f.lines.hit + f.branches.hit + f.functions.hit;
                    const totalCoverage = parseInt((totalHit / totalFound) * 100);
                    return totalCoverage;
                  }, []).reduce((p, c, _ ,a) => p + c / a.length, 0);
                  return (<tr>
                      <td> { h.git.branch } </td>
                      <td> { totalCoverage }% </td>
                      <td><div className="coverage_commit_message"> { h.git.message } </div></td>
                      <td> { h.git.committer_name } </td>
                      <td> { moment(h.git.committer_date * 1000).fromNow() } </td>
                      <td> { moment(h.run_at).fromNow() } </td>
                  </tr>)
              })}
            </table>
           </div>
        </div>);
    } else {
      return (<div className="text-center" style={{width:"100%",position: "absolute",top: "50%",transform: "translateY(-50%)"}}>
        No Coverage 🌧
      </div>);
    }
  }
}

export default Coverage;
