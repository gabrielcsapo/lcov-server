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
      const { fileName } = this.props.params;

      if(error) {
          console.log(error);
          return (<div className="text-center" style={{width:"100%",position: "absolute",top: "50%",transform: "translateY(-50%)"}}>
            Oh no 🙈 something happened...
          </div>);
      } else if(project) {
          const lineMap = {};
          const url = this.props.params.repoLink;
          const history = project.history;
          const file = history[0].source_files.filter((f) => {
              return f.title === fileName;
          })[0];
          const data = [[],[],[]];
          project.history.forEach((h) => {
            h.source_files.forEach(function(f) {
              if(f.title === fileName) {
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

          file.lines.details.forEach(function(l) {
              lineMap[l.line - 1] = l.hit;
          });
          const { lines, branches, functions } = file;
          const linePercentage = parseInt((lines.hit / lines.found) * 100);
          const branchPercentage = parseInt((branches.hit / branches.found) * 100);
          const functionPercentage = parseInt((functions.hit / functions.found) * 100);

          const owner = url.split('/')[url.split('/').length - 2];
          const repo = url.split('/')[url.split('/').length - 1].replace('.git', '');
          const { message, commit, branch, author_name, author_date } = history[0].git;
          const color = linePercentage >= 90 ? '#008a44' : linePercentage <= 89 && linePercentage >= 80 ? '#cfaf2a' : '#c75151';
          const commitUrl = url.replace('.git', `/commit/${commit}`);

          return (
              <div style={{margin: '5%'}}>
                  <div style={{display: 'inline-block', 'width': '100%'}}>
                    <div style={{float: 'left', textAlign: 'left'}}>
                        <h3> {owner} / <a href={`/coverage/${encodeURIComponent(url).replace(/\./g, '%2E')}`}>{repo}</a> / <a href={`/coverage/${encodeURIComponent(url).replace(/\./g, '%2E')}/file/${encodeURIComponent(fileName).replace(/\./g, '%2E')}`}>{fileName}</a> </h3>
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
                <h3> Coverage Over Time </h3>
                <CoverageChart width={window.innerWidth - (window.innerWidth * .20)} data={data} height={100} />
                <hr/>
                <br/>
                <ul className="list" style={{width:'75%', margin:'0 auto'}}>
                    {file.source.replace(/ /g, '\u00a0').split('\n').map(function(l, i){
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
                        } else {
                          return (<li className="list-item"></li>)
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
