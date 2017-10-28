module.exports.parseCoverage = function parseCoverage(history, branch) {
  // if no branch don't worry about parsing for a particular one

  const data = [[], [], []];
  history.forEach(function(history) {
    const { git, source_files } = history;
    if(branch ? (branch === (git.branch || git.git_branch)) : true) {
      let Total = 0;
      let TotalLines = 0;
      let TotalBranches = 0;
      let TotalFunctions = 0;

      source_files.forEach((file) => {
        const { lines={hit: 0, found: 0}, branches={hit: 0, found: 0}, functions={hit: 0, found: 0} } = file;

        if(lines && branches && functions) {
          TotalLines += parseInt(((lines.hit / lines.found) || 1) * 100);
          TotalBranches += parseInt(((branches.hit / branches.found) || 1) * 100);
          TotalFunctions += parseInt(((functions.hit / functions.found) || 1) * 100);
          Total += 1;
        }
      });

      data[0].push(TotalLines / Total);
      data[1].push(TotalBranches / Total);
      data[2].push(TotalFunctions / Total);
    }
  });

  // If there is only one data point
  // add another that is the same value to make a line
  if(data[0].length == 1) {
      data[0].push(data[0][0]);
      data[1].push(data[1][0]);
      data[2].push(data[2][0]);
  }

  return data;
};
