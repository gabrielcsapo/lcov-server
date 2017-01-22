import 'whatwg-fetch';

import React from 'react';
import ReactDOM from 'react-dom';
import CoverageChart from './coverageChart';
import moment from 'moment';

class Coverage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
     const url = this.props.params.repoLink;
     fetch(`/api/v1/coverage/${encodeURIComponent(url).replace(/\./g, '%2E')}`)
       .then((response) => {
         return response.json();
       }).then((project) => {
         console.log(project);
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
          const data = history.map((h) => {
            const { lines } = h.source_files[0];
            return lines.hit / lines.found;
          }, []);
          // If there is only one data point
          // add another that is the same value to make a line
          if(data.length == 1) {
              data[1] = data[0];
          }
          const percentage = parseInt(data[data.length - 1] * 100);
          const owner = url.split('/')[url.split('/').length - 2];
          const repo = url.split('/')[url.split('/').length - 1].replace('.git', '');
          const { message, commit, branch, author_name, author_date } = history[history.length - 1].git;
          const color = percentage >= 90 ? '#008a44' : percentage <= 89 && percentage >= 80 ? '#cfaf2a' : '#c75151';
          const commitUrl = url.replace('.git', `/commit/${commit}`);

          return (<div style={{marginBottom: '50px'}}>
             <div style={{marginLeft: '50px', marginRight: '50px'}}>
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
              <CoverageChart data={data} color={color} height={20} />
              <hr/>
              <ul style={{listStyle: 'none', textAlign: 'center'}}>
                 <li style={{lineHeight: '1.4', display: 'inline-block', margin: '5px', padding: '5px', backgroundColor: 'rgba(53, 74, 87, 0.05)'}}>
                     Last Build
                     <div>
                         <b> { history[history.length - 1].run_at } </b>
                     </div>
                 </li>
                 <li style={{lineHeight: '1.4', display: 'inline-block', margin: '5px', padding: '5px', backgroundColor: 'rgba(53, 74, 87, 0.05)'}}>
                     Total Files
                     <div>
                         <b> { history[history.length - 1].source_files.length } </b>
                     </div>
                 </li>
                 <li style={{lineHeight: '1.4', display: 'inline-block', margin: '5px', padding: '5px', backgroundColor: 'rgba(53, 74, 87, 0.05)'}}>
                     Total Builds
                     <div>
                         <b> { history.length } </b>
                     </div>
                 </li>
                 <li style={{display: 'inline-block', margin: '5px', padding: '5px', backgroundColor: 'rgba(53, 74, 87, 0.05)'}}>
                     Badge
                     <div>
                         <img src={`/${encodeURIComponent(url).replace(/\./g, '%2E')}.svg`} />
                     </div>
                 </li>
              </ul>
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
