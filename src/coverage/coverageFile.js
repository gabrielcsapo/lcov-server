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
          const history = project.history[0];
          const file = history.source_files.filter((f) => {
              return f.title === fileName;
          })[0];

          file.lines.details.forEach(function(l) {
              lineMap[l.line - 1] = l.hit;
          });
          const { lines, branches, functions } = file;
          const linePercentage = parseInt((lines.hit / lines.found) * 100);
          const branchPercentage = parseInt((branches.hit / branches.found) * 100);
          const functionPercentage = parseInt((functions.hit / functions.found) * 100);

          const owner = url.split('/')[url.split('/').length - 2];
          const repo = url.split('/')[url.split('/').length - 1].replace('.git', '');
          const { message, commit, branch, author_name, author_date } = history.git;
          const color = linePercentage >= 90 ? '#008a44' : linePercentage <= 89 && linePercentage >= 80 ? '#cfaf2a' : '#c75151';
          const commitUrl = url.replace('.git', `/commit/${commit}`);

          return (
              <div>
                  <div style={{display: 'inline-block', width: '100%', margin: '5%'}}>
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
                <ul className="list" style={{width:'75%', margin:'0 auto'}}>
                    {file.source.replace(/ /g, '\u00a0').split('\n').map(function(l, i){
                        const hit = lineMap[i];
                        if(l.length > 0) {
                            return (<li className={hit > 0 ? 'list-item list-item-success' : 'list-item list-item-danger'}>
                              <div className="list-item-left">{ l }</div>
                              <div className="list-item-right">{ lineMap[i] }</div>
                            </li>)
                        } else {
                            return (<li></li>)
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
