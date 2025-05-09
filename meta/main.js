import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

async function loadData() {
    const data = await d3.csv('loc.csv', (row) => ({
      ...row,
      line: Number(row.line), // or just +row.line
      depth: Number(row.depth),
      length: Number(row.length),
      date: new Date(row.date + 'T00:00' + row.timezone),
      datetime: new Date(row.datetime),
    }));
  
    return data;
}

function processCommits(data) {
    return d3
      .groups(data, (d) => d.commit)
      .map(([commit, lines]) => {
        let first = lines[0];
        let { author, date, time, timezone, datetime } = first;
        let ret = {
          id: commit,
          url: 'https://github.com/vis-society/lab-7/commit/' + commit,
          author,
          date,
          time,
          timezone,
          datetime,
          hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
          totalLines: lines.length,
        };
  
        Object.defineProperty(ret, 'lines', {
          value: lines,
          writable: false,
          enumerable: false,
          configurable: false
        });
  
        return ret;
    });
}

function renderCommitInfo(data, commits) {
    // Create the dl element
    const dl = d3.select('#stats').append('dl').attr('class', 'stats');
  
    // Add total LOC
    dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
    dl.append('dd').text(data.length);
  
    // Add total commits
    dl.append('dt').text('Total commits');
    dl.append('dd').text(commits.length);
  
    // Add more stats as needed...

    // Longest file
    const grouped = d3.groups(data, (d) => (d).file)
    const longest = Math.max(...grouped.map(d => d[1].length))
    dl.append('dt').html('Longest file')
    dl.append('dd').text(longest)

    // Number of files
    const num = grouped.length
    dl.append('dt').html('Number of files')
    dl.append('dd').text(num)

    // Maximum number of lines of code per commit
    const most_lines = Math.max(...commits.map(c => c.totalLines));
    dl.append('dt').html('Most lines added in one commit')
    dl.append('dd').text(most_lines)

    // Minimum number of lines of code per commit
    const min_lengths = Math.min(...commits.map(c => c.totalLines))
    dl.append('dt').html('Least lines added in one commit')
    dl.append('dd').text(min_lengths)

    // Average number of lines of code per commit
    const sum_lengths = commits.map(c => c.totalLines).reduce((mean, value) => mean + parseInt(value), 0);
    const avg_length = Math.round(sum_lengths / commits.length)
    dl.append('dt').html('Average number of lines added per commit')
    dl.append('dd').text(avg_length)
}

function renderScatterPlot(data, commits) {
    const width = 1000;
    const height = 600;

    const svg = d3
    .select('#chart')
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('overflow', 'visible');

    const xScale = d3
    .scaleTime()
    .domain(d3.extent(commits, (d) => d.datetime))
    .range([0, width])
    .nice();

    const yScale = d3.scaleLinear().domain([0, 24]).range([height, 0]);
    
}

   
      
  
let data = await loadData();
let commits = processCommits(data);

renderCommitInfo(data, commits);

renderScatterPlot(data, commits);
