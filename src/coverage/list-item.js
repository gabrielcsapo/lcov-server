import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import parse from 'git-url-parse';

import CoverageChart from '../components/coverageChart';
import Error from '../components/error';
import Loading from '../components/loading';
import NoCoverage from '../components/noCoverage';
import { parseCoverage } from '../lib/util';

class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coverage: {},
      error: '',
      loading: true
    };
  }

  async componentDidMount() {
    const { repo } = this.props;

    const { resource, owner, name } = parse(repo);
    const protocol = resource.substring(resource.lastIndexOf('.') + 1, resource.length);
    const url = `/api/coverage/${resource.replace(/\./g, '%2E').replace(`.${protocol}`, '')}/${owner}/${name}?limit=5`;

    try {
      const response = await fetch(url);
      const coverage = await response.json();

      this.setState({
        coverage: coverage[0],
        loading: false
      });
    } catch(ex) {
      this.setState({
        error: ex.toString(),
        loading: false
      });
    }
  }

  render() {
    const { coverage, loading, error } = this.state;

    if(loading) {
      return <Loading />;
    }

    if(error) {
      return <Error error={error}/>;
    }

    if(Object.keys(coverage).length > 0) {
      const { _id, history } = coverage;

      if(!history) {
        return (<NoCoverage />);
      }

      const data = parseCoverage(history);

      const { message, commit, branch, git_branch, author_name, author_date } = history[0].git;
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
                     <a className="coverage-commit-message" href={commitUrl} target="_blank" rel="noopener noreferrer"> {message} </a>
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
      return (<NoCoverage />);
    }

  }
}

ListItem.propTypes = {
  repo: PropTypes.string
};

export default ListItem;
