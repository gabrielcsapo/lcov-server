import React from 'react';
import Moment from 'moment';
import parse from 'git-url-parse';

import Loading from '../components/loading';
import Error from '../components/error';
import NoCoverage from '../components/noCoverage';

class Feed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      feed: [],
      loading: true
    };
  }

  async componentDidMount() {
    let url = '/api/feed';

    try {
      const response = await fetch(url);
      const feed = await response.json();

      this.setState({
        feed,
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
    const { feed, loading, error } = this.state;

    if(error) {
      return <Error error={error}/>;
    }

    if(loading) {
      return <Loading />;
    }

    if(feed.length > 0) {
      return <div style={{ margin: '0 auto', width: '50%' }}>
        <div className="list">
          { feed.map((repo, i) => {
            const { git, source_files } = repo;
            const { message, commit, branch, git_branch, remotes } = git;
            const { resource, owner, name } = parse(remotes.url);
            const protocol = resource.substring(resource.lastIndexOf('.') + 1, resource.length);
            const commitUrl = `${remotes.url.replace('.git', '')}/commit/${commit}`;
            const percentage = source_files.map((f) => {
              const { lines={ found: 0, hit: 0 }, branches={ found: 0, hit: 0 }, functions={ found: 0, hit: 0 } } = f;

              const totalFound = lines.found + branches.found + functions.found;
              const totalHit = lines.hit + branches.hit + functions.hit;
              const totalCoverage = parseInt((totalHit / totalFound) * 100);
              return totalCoverage;
            }, []).reduce((p, c, _ ,a) => p + c / a.length, 0);
            const color = percentage >= 85 ? '#3DB712' : percentage <= 85 && percentage >= 70 ? '#caa300' : '#cc5338';

            return <div key={`${name}/${i}`} className="list-item">
              <div style={{ position: 'relative', height: '50px' }}>
                <div style={{ float: 'left' }}>
                  <a target="_blank" rel="noopener noreferrer" href={ commitUrl }>{ Moment(repo.run_at).fromNow() } on { git_branch || branch || 'unknown' }</a>
                </div>
                <div style={{ float: 'right' }}>
                  <div className="badge" style={{ opacity: .6, backgroundColor: color, color: 'white' }}> { parseInt(percentage) }%</div>
                </div>
              </div>
              <h3 className="text-center">
                <a href={`/coverage/${resource.replace(/\./g, '%2E').replace(`.${protocol}`, '')}/${owner}/${name}`}> &nbsp;{ owner }/{ name } </a>
                <br/>
                <small style={{ fontWeight: '100', color: '#969696' }}> { message } </small>
              </h3>
            </div>;
          }) }
        </div>
      </div>;
    } else {
      return <NoCoverage />;
    }
  }
}

export default Feed;
