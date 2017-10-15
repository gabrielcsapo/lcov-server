import React from 'react';
import moment from 'moment';
import Select from 'react-select';

import CoverageChart from './chart';

import Table from '../components/table';
import Error from '../components/error';
import Loading from '../components/loading';

class Coverage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      selectedBranch: '',
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

  onChangeBranch(branch) {
    this.setState({
      selectedBranch: branch ? branch.value : ''
    });
  }

  render() {
    const { selectedBranch, project, error, loading } = this.state;

    if(loading) {
      return (<Loading/>);
    } else if(error) {
      return (<Error error={error} />)
    } else if(project) {
      const { source, owner, name } = this.props.match.params;

      const { _id, history } = project;
      const allBranches = [];
      const data = [[], [], []];
      history.forEach(function(history) {
        const { git } = history;
        const { lines, branches, functions } = history.source_files[0];
        allBranches.push(git.branch || git.git_branch);

        if(selectedBranch && selectedBranch === (git.branch || git.git_branch)) {
          data[0].push(parseInt(((lines.hit / lines.found) || 1) * 100))
          data[1].push(parseInt(((branches.hit / branches.found) || 1) * 100))
          data[2].push(parseInt(((functions.hit / functions.found) || 1) * 100))
        } else if(!selectedBranch) {
          data[0].push(parseInt(((lines.hit / lines.found) || 1) * 100))
          data[1].push(parseInt(((branches.hit / branches.found) || 1) * 100))
          data[2].push(parseInt(((functions.hit / functions.found) || 1) * 100))
        } else {
          // noop
        }
      }, []);

      // If there is only one data point
      // add another that is the same value to make a line
      if(data[0].length == 1) {
          data[0].push(data[0][0]);
          data[1].push(data[1][0]);
          data[2].push(data[2][0]);
      };

      const { message, commit, branch, git_branch, author_name, author_date } = history[history.length - 1].git;
      const commitUrl = `${_id.replace('.git', '')}/commit/${commit}`;

      function reduceBuilds(build) {
        let totalCoverage = build.source_files.map((f) => {
          const totalFound = f.lines.found + f.branches.found + f.functions.found;
          const totalHit = f.lines.hit + f.branches.hit + f.functions.hit;
          const totalCoverage = parseInt((totalHit / totalFound) * 100);
          return totalCoverage;
        }, []).reduce((p, c, _ ,a) => p + c / a.length, 0);
        return {
          "Branch": build.git.git_branch || build.git.branch || <span style={{ color: "#9a9a9a" }}> unknown </span>, // backwards compatible
          "Coverage": `${totalCoverage}%`,
          "Commit": build.git.message,
          "Committer": build.git.committer_name,
          "Commit Time": moment(build.git.committer_date * 1000).fromNow(),
          "Recieved": moment(build.run_at).fromNow()
        }
      }

      const options = allBranches.filter((a, i) => allBranches.indexOf(a) == i && !!a).sort().map((b) => {
        return { value: b, label: b }
      });

      function reduceSourceFiles(file) {
        const totalFound = file.lines.found + file.branches.found + file.functions.found;
        const totalHit = file.lines.hit + file.branches.hit + file.functions.hit;
        const totalCoverage = parseInt((totalHit / totalFound) * 100);
        const fileName = encodeURIComponent(file.title).replace(/\./g, '$2E');

        return {
          "Coverage": `${totalCoverage}%`,
          "File": <a href={`/coverage/${source.replace(/\./g, '%2E')}/${owner}/${name}/${fileName}`}>
              { file.title }
          </a>,
          "Lines": `${file.lines.hit} / ${file.lines.found}`,
          "Branches": `${file.branches.hit} / ${file.branches.found}`,
          "Functions": `${file.functions.hit} / ${file.functions.found}`
        }
      }

      return (<div className="coverage">
         <div className="coverage-header">
          <div style={{display: 'inline-block', width: '100%'}}>
            <div style={{float: 'left', textAlign: 'left'}}>
                <h3>
                  <a href={`/coverage/${source.replace(/\./g, '%2E')}/${owner}/`}>{owner}</a> / <a href={`/coverage/${source.replace(/\./g, '%2E')}/${owner}/${name}`}>{name}</a>
                </h3>
                <p>
                  <a className="coverage-commit-message" href={commitUrl} target="_blank"> {message} </a>
                  on branch
                  <b> {branch || git_branch} </b>
                  {moment(author_date * 1000).fromNow()}
                  &nbsp;by
                  <b> {author_name} </b>
                </p>
            </div>
            <h3 style={{float: 'right'}}> <img src={`/badge/${source.replace(/\./g, '%2E')}/${owner}/${name}.svg`} /> </h3>
          </div>
          <div>
            <Select
              matchPos="any"
              value={selectedBranch}
              options={options}
              onChange={this.onChangeBranch.bind(this)}
            />
          </div>
          <CoverageChart width={window.innerWidth - 200} data={data} height={100} />
          <hr/>
          <h4> Source Files ({ history[history.length - 1].source_files.length })</h4>
          <Table data={history[0].source_files.map(reduceSourceFiles)} chunk={5}/>
          <h4> Recent Builds ({ history.length })</h4>
          <Table data={history.map(reduceBuilds)} chunk={9}/>
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
