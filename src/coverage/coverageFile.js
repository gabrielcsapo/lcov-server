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
    const { service, owner, repo } = this.props.params;
    const url = `https://${service}.com/${owner}/${repo}.git`;

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
      const { service, owner, repo } = this.props.params;
      const file = this.props.params.file.replace('$2E', '.');

      const url = `https://${service}.com/${owner}/${repo}.git`;

      if(error) {
          return (<div className="text-center" style={{width:"100%",position: "absolute",top: "50%",transform: "translateY(-50%)"}}>
            Oh no 🙈 something happened...
            <br/>
            <br/>
            <pre style={{width: '50%', margin: '0 auto'}}>
              {error}
            </pre>
          </div>);
      } else if(project) {
          const lineMap = {};
          const history = project.history;
          const source = history[0].source_files.filter((f) => {
              return f.title === file;
          })[0];
          const data = [[],[],[]];
          project.history.forEach((h) => {
            h.source_files.forEach(function(f) {
              if(f.title === file) {
                const { lines, branches, functions } = f;
                const linePercentage = parseInt((lines.hit / lines.found) * 100);
                const branchPercentage = parseInt((branches.hit / branches.found) * 100);
                const functionPercentage = parseInt((functions.hit / functions.found) * 100);
                data[0].push(linePercentage);
                data[1].push(branchPercentage);
                data[2].push(functionPercentage);
              }
            });
          });

          const { lines, branches, functions } = source;
          lines.details.forEach(function(l) {
              lineMap[l.line - 1] = l.hit;
          });
          const linePercentage = parseInt((lines.hit / lines.found) * 100);
          const branchPercentage = parseInt((branches.hit / branches.found) * 100);
          const functionPercentage = parseInt((functions.hit / functions.found) * 100);

          const { message, commit, branch, author_name, author_date } = history[0].git;
          const color = linePercentage >= 90 ? '#008a44' : linePercentage <= 89 && linePercentage >= 80 ? '#cfaf2a' : '#c75151';
          const commitUrl = url.replace('.git', `/commit/${commit}`);

          return (
              <div style={{marginLeft: '50px', marginRight: '50px'}}>
                  <div style={{display: 'inline-block', 'width': '100%'}}>
                    <div style={{float: 'left', textAlign: 'left'}}>
                        <h3> <a href={`/coverage/${service}/${owner}/`}>{owner}</a> / <a href={`/coverage/${service}/${owner}/${repo}`}>{repo}</a> / <a href={`/coverage/${service}/${owner}/${repo}/${encodeURIComponent(file).replace(/\./g, '$2E')}`}>{file}</a> </h3>
                        <p>
                          <a href={commitUrl} target="_blank"> {message} </a>
                          on branch
                          <b> {branch} </b>
                          {moment(author_date * 1000).fromNow()}
                          &nbsp;by
                          <b> {author_name} </b>
                        </p>
                    </div>

                    <h3 style={{float: 'right', color: color}}>{ linePercentage }%</h3>
                </div>
                <CoverageChart width={window.innerWidth - (window.innerWidth * .20)} data={data} height={100} />
                <hr/>
                <ul style={{listStyle: 'none', textAlign: 'center'}}>
                   <li style={{lineHeight: '1.4', display: 'inline-block', margin: '5px', padding: '15px', backgroundColor: 'rgba(53, 74, 87, 0.05)'}}>
                       <div style={{marginBottom: '5px'}}> Line Percentage </div>
                       <div>
                           <b> { linePercentage }%</b>
                       </div>
                   </li>
                   <li style={{lineHeight: '1.4', display: 'inline-block', margin: '5px', padding: '15px', backgroundColor: 'rgba(53, 74, 87, 0.05)'}}>
                       <div style={{marginBottom: '5px'}}> Branch Percentage </div>
                       <div>
                           <b> { branchPercentage }%</b>
                       </div>
                   </li>
                   <li style={{lineHeight: '1.4', display: 'inline-block', margin: '5px', padding: '15px', backgroundColor: 'rgba(53, 74, 87, 0.05)'}}>
                       <div style={{marginBottom: '5px'}}> Function Percentage </div>
                       <div>
                           <b> { functionPercentage }%</b>
                       </div>
                   </li>
                </ul>
                <hr/>
                <br/>
                <ul className="list" style={{width:'75%', margin:'0 auto'}}>
                    {source.source.replace(/ /g, '\u00a0').split('\n').map(function(l, i){
                        const hit = lineMap[i];
                        if(l.length > 0) {
                            return (<li className="list-item">
                              { l }
                              {hit > 0 ?
                                <div className="badge badge-success">{ lineMap[i] }</div>
                                :
                                <div className="badge badge-danger">0</div>
                              }
                            </li>)
                        }
                    }, [])}
                </ul>
              </div>
          );
      } else {
        return (<div className="text-center" style={{width:"100%", position: "absolute", top: "50%", transform: "translateY(-50%)"}}>
          No Coverage 🌧
        </div>);
      }
  }
}

export default Coverage;
