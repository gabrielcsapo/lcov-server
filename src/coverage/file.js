import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import CoverageChart from '../components/coverageChart';
import Error from '../components/error';
import NoCoverage from '../components/noCoverage';
import Loading from '../components/loading';
import FileView from '../components/fileView';

import { parseCoverage } from '../lib/util';

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
        return <Loading />;
      }

      if(error) {
          return <Error error={error}/>;
      }

      if(project) {
          const lineMap = {};
          const file = this.props.match.params.file.replace('$2E', '.');
          let { _id, history } = project;
          history = history[0];

          const fileSource = history.source_files.filter((f) => {
              return f.title === file;
          })[0];

          const { lines={ found: 0, hit: 0 }, branches={ found: 0, hit: 0 }, functions={ found: 0, hit: 0 } } = fileSource;

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
               <CoverageChart width={window.innerWidth - 200} data={parseCoverage(project.history)} height={100} />
            </div>
            <br/>
            <FileView source={fileSource.source} lineMap={lineMap} extension={file.substr(file.lastIndexOf('.') + 1, file.length)}/>
          </div>);
      } else {
        return <NoCoverage/>;
      }
  }
}

File.propTypes = {
  match: PropTypes.object
};

export default File;
