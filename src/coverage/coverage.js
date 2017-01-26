import 'whatwg-fetch';

import React from 'react';
import CoverageChart from './coverageChart';
import moment from 'moment';

class Coverage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: ''
    };
  }

  componentDidMount() {
     const url = this.props.params.repoLink;
     fetch(`/api/v1/coverage/${encodeURIComponent(url).replace(/\./g, '%2E')}`)
       .then((response) => {
         return response.json();
       }).then((project) => {
         this.setState({
           project: project[0]
         });
       }).catch((ex) => {
         this.setState({
           error: ex.toString()
         });
       });
  }

  render() {
      const { project, error } = this.state;

      if(error) {
          console.log(error);
          return (<div className="text-center" style={{width:"100%",position: "absolute",top: "50%",transform: "translateY(-50%)"}}>
            Oh no 🙈 something happened...
          </div>);
      } else if(project) {
          const url = project._id;
          const history = project.history;
          const data = [[], [], []];
          history.forEach(function(history) {
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
          const { message, commit, branch, author_name, author_date } = history[history.length - 1].git;
          const color = percentage >= 90 ? '#008a44' : percentage <= 89 && percentage >= 80 ? '#cfaf2a' : '#c75151';
          const commitUrl = url.replace('.git', `/commit/${commit}`);

          return (<div style={{marginBottom: '50px'}}>
             <div style={{marginLeft: '50px', marginRight: '50px'}}>
              <div style={{display: 'inline-block', width: '100%'}}>
                <div style={{float: 'left', textAlign: 'left'}}>
                    <h3> {owner} / <a href={`/coverage/${encodeURIComponent(url).replace(/\./g, '%2E')}`}>{repo}</a> </h3>
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
              <CoverageChart width={window.innerWidth - 200} data={data} color={color} height={100} />
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
                         <img src={`/${encodeURIComponent(url).replace(/\./g, '%2E')}.svg`} />
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
                    return (<tr>
                        <td> { totalCoverage }% </td>
                        <td>
                            <a href={`/coverage/${encodeURIComponent(url).replace(/\./g, '%2E')}/file/${encodeURIComponent(f.title).replace(/\./g, '%2E')}`}> 
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
                    <th>Time</th>
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
                        <td> { h.git.message } </td>
                        <td> { h.git.committer_name } </td>
                        <td> { moment(h.git.committer_date * 1000).fromNow() } </td>
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
