import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import Loading from '../components/loading';
import Error from '../components/error';
import NoCoverage from '../components/noCoverage';
import Item from './list-item';

class List extends React.Component {
  constructor(props) {
    super(props);

    const { page } = props.match.params;

    this.state = {
      repos: [],
      raw: [],
      selected: '',
      chunk: 6,
      title: '',
      page: page || 1,
      loading: true
    };
  }

  async componentDidMount() {
    const { source, owner } = this.props.match.params;
    const { chunk } = this.state;

    let url = '/api/repos';

    if(source && owner) {
      url = `/api/repos/${source}/${owner}`;
      this.setState({
        title: `Filtering coverage reports for ${owner} on ${source}`
      });
    }

    try {
      const response = await fetch(url);
      const repos = await response.json();

      this.setState({
        repos: repos.slice(0,(repos.length+chunk-1)/chunk|0).map(function(c,i) { return repos.slice(chunk*i, chunk*i+chunk); }),
        raw: repos,
        loading: false
      });
    } catch(ex) {
      this.setState({
        error: ex.toString(),
        loading: false
      });
    }
  }

  nextPage() {
    const { page, repos } = this.state;

    let newPage = (page + 1) > repos.length ? 1 : page + 1;

    this.setState({
      page: newPage
    });

    history.pushState({}, null, `/coverage/${newPage}`);
  }

  previousPage() {
    const { page } = this.state;

    let newPage = (page - 1) < 1 ? 1 : page - 1;

    this.setState({
      page: newPage
    });

    history.pushState({}, null, `/coverage/${newPage}`);
  }

  onSelect(url) {
    const { raw, chunk } = this.state;

    if(url) {
      this.setState({
        repos: [[url.value]],
        selected: url.value,
        page: 1
      });
    } else {
      this.setState({
        repos: raw.slice(0,(raw.length+chunk-1)/chunk|0).map(function(c,i) { return raw.slice(chunk*i, chunk*i+chunk); }),
        selected: "",
        page: 1
      });
    }
  }

  render() {
    const { raw, repos, page, selected, title, loading, error } = this.state;

    if(error) {
      return <Error error={error}/>;
    }

    if(loading) {
      return <Loading />;
    }

    if(repos.length > 0) {

      const options = raw.map((r) => {
        return { value: r, label: r };
      });

      return <div>
        <div style={{ width: "85%", margin: "0 auto", marginBottom: "50px" }}>
          <Select
            matchPos="any"
            value={selected}
            options={options}
            onChange={this.onSelect.bind(this)}
          />
        </div>
        { title ?
          <div className="text-center">
            <br/>
            <i> { title } (<a href="/coverage">clear</a>)</i>
            <br/>
            <br/>
          </div>
        : '' }
        <div>
          { repos[page - 1].map((repo) => {
            return <Item key={`${repo}`} repo={repo} />;
          }) }
        </div>
        <div style={{ position: "relative", width: "80%", height: "50px", textAlign: "center", margin: "0 auto", marginBottom: "50px", lineHeight: "100px" }}>
          <button className="btn" style={{ left: 0, position: "absolute", top: "25px" }} onClick={this.previousPage.bind(this)}> Previous </button>

          <div style={{ display: "inline-block" }}> {page}/{repos.length} </div>

          <button className="btn" style={{ right: 0, position: "absolute", top: "25px" }} onClick={this.nextPage.bind(this)}> Next </button>
        </div>
      </div>;
    } else {
      return <NoCoverage />;
    }
  }
}

List.propTypes = {
  match: PropTypes.object,
  page: PropTypes.number
};

export default List;
