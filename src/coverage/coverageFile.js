import 'whatwg-fetch';

import React from 'react';
import CoverageChart from './coverageChart';
import moment from 'moment';

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
      const { source, owner, name } = this.props.match.params;

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
          const lineMap = {};
          const file = this.props.match.params.file.replace('$2E', '.');
          const history = project.history[project.history.length - 1];
          const url = history._id;
          const fileSource = history.source_files.filter((f) => {
              return f.title === file;
          })[0];
          const data = [[],[],[]];
          project.history.forEach((h) => {
            h.source_files.forEach((f) => {
              if(f.title === file) {
                const { lines, branches, functions } = f;
                const linePercentage = parseInt(((lines.hit / lines.found) || 1) * 100);
                const branchPercentage = parseInt(((branches.hit / branches.found) || 1) * 100);
                const functionPercentage = parseInt(((functions.hit / functions.found) || 1) * 100);
                data[0].push(linePercentage);
                data[1].push(branchPercentage);
                data[2].push(functionPercentage);
              }
            });
          });

          const { lines, branches, functions } = fileSource;
          lines.details.forEach((l) => {
              lineMap[l.line - 1] = l.hit;
          });
          const linePercentage = parseInt(((lines.hit / lines.found) || 1) * 100);
          const branchPercentage = parseInt(((branches.hit / branches.found) || 1) * 100);
          const functionPercentage = parseInt(((functions.hit / functions.found) || 1) * 100);
          const percentage = parseInt((linePercentage + branchPercentage + functionPercentage) / 3);
          const { message, commit, branch, author_name, author_date } = history.git;
          const color = linePercentage >= 90 ? '#008a44' : linePercentage <= 89 && linePercentage >= 80 ? '#cfaf2a' : '#c75151';
          const commitUrl = url.replace('.git', `/commit/${commit}`);

          return (<div className="coverage">
              <div className="coverage_header">
                 <div style={{display: 'inline-block', width: '100%'}}>
                   <div style={{float: 'left', textAlign: 'left'}}>
                       <h3> <a href={`/coverage/${source.replace(/\./g, '%2E')}/${owner}/`}>{owner}</a> / <a href={`/coverage/${source.replace(/\./g, '%2E')}/${owner}/${name}`}>{name}</a> / <a href={`/coverage/${source.replace(/\./g, '%2E')}/${owner}/${name}/${encodeURIComponent(file).replace(/\./g, '$2E')}`}>{file}</a> </h3>
                       <p>
                         <a className="coverage_commit_message" href={commitUrl} target="_blank"> {message} </a>
                         on branch
                         <b> {branch} </b>
                         {moment(author_date * 1000).fromNow()}
                         &nbsp;by
                         <b> {author_name} </b>
                       </p>
                   </div>

                   <h3 style={{float: 'right', color: color}}>{ percentage }%</h3>
                 </div>
                 <CoverageChart width={window.innerWidth - 200} data={data} height={100} />
              </div>
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
                  {fileSource.source.replace(/ /g, '\u00a0').split('\n').map((l, i) => {
                      const hit = lineMap[i];
                      if(l.length > 0) {
                          return (<li className="list-item" style={{ position: 'relative', overflow: 'visible', border: 'none', borderBottom: '1px solid #dedede'}}>
                            <div className="badge badge-white" style={{ position: 'absolute', left: '-15px', padding: '5px'}}>{ i } </div>
                            { l }
                            {hit > 0 ?
                              <div className="badge badge-success">{ lineMap[i] }</div>
                              :
                              <div className="badge badge-danger" style={{ padding: '5px' }}>0</div>
                            }
                          </li>)
                      }
                  }, [])}
              </ul>
            </div>);
      } else {
        return (<div className="text-center" style={{width:"100%", position: "absolute", top: "50%", transform: "translateY(-50%)"}}>
          No Coverage 🌧
        </div>);
      }
  }
}

export default Coverage;
