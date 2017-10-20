import React from 'react';
import moment from 'moment';

import CoverageChart from './chart';
import Error from '../components/error';
import Loading from '../components/loading';
import FileView from '../components/fileView';

class File extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      loading: true
    };
  }

  componentDidMount() {
    const { source, owner, name } = this.props.match.params;

    fetch(`/api/coverage/${source}/${owner}/${name}`)
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
        return (<Loading />);
      } else if(error) {
          return (<Error error={error}/>)
      } else if(project) {
          const lineMap = {};
          const file = this.props.match.params.file.replace('$2E', '.');
          let { _id, history } = project;
          history = history[project.history.length - 1];

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

          // make it a straight line double the values
          if(data[0].length == 1) {
            data[0].push(data[0][0])
            data[1].push(data[1][0])
            data[2].push(data[2][0])
          }

          const { lines, branches, functions } = fileSource;
          lines.details.forEach((l) => {
              lineMap[l.line - 1] = l.hit;
          });
          const linePercentage = parseInt(((lines.hit / lines.found) || 1) * 100);
          const branchPercentage = parseInt(((branches.hit / branches.found) || 1) * 100);
          const functionPercentage = parseInt(((functions.hit / functions.found) || 1) * 100);
          const percentage = parseInt((linePercentage + branchPercentage + functionPercentage) / 3);
          const color = linePercentage >= 90 ? '#008a44' : linePercentage <= 89 && linePercentage >= 80 ? '#cfaf2a' : '#c75151';

          const { message, commit, branch, author_name, author_date } = history.git;
          const commitUrl = `${_id.replace('.git', '')}/commit/${commit}`;
          console.log(commitUrl);
          return (<div className="coverage">
              <div className="coverage-header">
                 <div style={{display: 'inline-block', width: '100%'}}>
                   <div style={{float: 'left', textAlign: 'left'}}>
                       <h3> <a href={`/coverage/${source.replace(/\./g, '%2E')}/${owner}/`}>{owner}</a> / <a href={`/coverage/${source.replace(/\./g, '%2E')}/${owner}/${name}`}>{name}</a> / <a href={`/coverage/${source.replace(/\./g, '%2E')}/${owner}/${name}/${encodeURIComponent(file).replace(/\./g, '$2E')}`}>{file}</a> </h3>
                       <p>
                         <a className="coverage-commit-message" href={commitUrl} target="_blank"> {message} </a>
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
              <br/>
              <FileView source={fileSource.source} lineMap={lineMap} extension={file.substr(file.lastIndexOf('.') + 1, file.length)}/>
            </div>);
      } else {
        return (<div className="text-center" style={{width:"100%", position: "absolute", top: "50%", transform: "translateY(-50%)"}}>
          No Coverage 🌧
        </div>);
      }
  }
}

export default File;
