import React from 'react';
import moment from 'moment';
import parse from 'git-url-parse';

import CoverageChart from './chart';
import Error from '../components/error';

class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coverage: {},
      error: '',
      title: '',
      loading: true
    };
  }

  componentDidMount() {
    const { repo } = this.props;

    const { resource, owner, name } = parse(repo);
    const protocol = resource.substring(resource.lastIndexOf('.') + 1, resource.length);

    fetch(`/api/coverage/${resource.replace(/\./g, '%2E').replace(`.${protocol}`, '')}/${owner}/${name}?limit=5`)
      .then((response) => {
        return response.json();
      }).then((coverage) => {
        this.setState({
          coverage: coverage[0],
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
    const { coverage, title, error } = this.state;

    if(error) {
      return (<Error error={error}/>)
    } else if(Object.keys(coverage).length > 0) {
      const { _id, history } = coverage;

      if(history) {
        const data = [[], [], []];
        history.forEach(function(history) {
          const { lines, branches, functions } = history.source_files[0];
          if(lines && branches && functions) {
            data[0].push(parseInt(((lines.hit / lines.found) || 1) * 100))
            data[1].push(parseInt(((branches.hit / branches.found) || 1) * 100))
            data[2].push(parseInt(((functions.hit / functions.found) || 1) * 100))
          } else {
            data[0].push(0)
            data[1].push(0)
            data[2].push(0)
          }
        }, []);
        // If there is only one data point
        // add another that is the same value to make a line
        if(data[0].length == 1) {
            data[0].push(data[0][0]);
            data[1].push(data[1][0]);
            data[2].push(data[2][0]);
        };

        const percentage = parseInt(data[0][data[0].length - 1]);
        const { message, commit, branch, git_branch, author_name, author_date } = coverage.history[coverage.history.length - 1].git;
        const { resource, owner, name } = parse(_id);
        const protocol = resource.substring(resource.lastIndexOf('.') + 1, resource.length);
        const commitUrl = `${_id.replace('.git', '')}/commit/${commit}`;

        return (
          <div className="coverage">
            <div className="coverage-header">
               <div style={{display: 'inline-block', width: '100%'}}>
                 <div style={{float: 'left', textAlign: 'left'}}>
                     <h3> <a href={`/coverage/${resource.replace(/\./g, '%2E').replace(`.${protocol}`, '')}/${owner}/`}>{owner}</a> / <a href={`/coverage/${resource.replace(/\./g, '%2E').replace(`.${protocol}`, '')}/${owner}/${name}`}>{name}</a> </h3>
                     <p>
                       <a className="coverage-commit-message" href={commitUrl} target="_blank"> {message} </a>
                       on branch
                       <b> {branch || git_branch} </b>
                       {moment(author_date * 1000).fromNow()}
                       &nbsp;by
                       <b> {author_name} </b>
                     </p>
                 </div>

                 <h3 style={{float: 'right' }}> <img src={`/badge/${resource.replace(/\./g, '%2E')}/${owner}/${name}.svg`} /> </h3>
               </div>
               <CoverageChart width={window.innerWidth - 200} height={100} data={data} />
            </div>
          </div>
        );
      } else {
        return (<div className="coverage text-center" style={{ border: "1px solid #dedede", position: "relative", height: "300px" }}>
          <div style={{width:"100%",position: "absolute",top: "50%",transform: "translateY(-50%)"}}>
            No Coverage 🌧
          </div>
        </div>);
      }
    } else {
      return (<div className="coverage text-center" style={{ border: "1px solid #dedede", position: "relative", height: "300px" }}>
        <div style={{width:"100%",position: "absolute",top: "50%",transform: "translateY(-50%)"}}>
          No Coverage 🌧
        </div>
      </div>);
    }
  }
}

export default ListItem;
