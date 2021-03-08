
const linesConfig = [{
  label: 'Mean',
  key: 'mean',
  color: 'red'
}, {
  label: 'Low',
  key: 'low',
  color: 'blue'
}, {
  label: 'High',
  key: 'high',
  color: 'green'
}];

const _generatePropLineFormat = (data, propName) =>
  data.filter(d => d[propName] !== null)
      .map((d) => ({x: d.day, y: d[propName]}));

const getPointsValues = (d) => {
  const values = [];
  for(let {key} of linesConfig) {
    if(d[key]) values.push(d[key]);
  }
  return values;
}

const _generateYRange = resData => {
  //get the lowest value for all the data
  const minY = resData
    .reduce((min, d) => 
      Math.min(min, ...getPointsValues(d)),
      resData[0].low || 0
    );
  //get the higest value for all the data
  const maxY = resData
    .reduce((max, d) =>
      Math.max(max, ...getPointsValues(d)),
      resData[0].high || 0
    );
  // might be looking good if we display 30% of offset relative to the range.
  const yExtraRange = (maxY - minY) * 0.3;
  //minimum 0
  return [Math.max(minY - yExtraRange, 0), maxY + yExtraRange]
}

const generateLines = (resData) => {
  const lines = [];
  for(let { key, color, label} of linesConfig) {
    const currLine = _generatePropLineFormat(resData, key);
    if(currLine.length > 0) {
      lines.push({
        color,
        label,
        data: currLine
      });
    }
  }
  return lines;
};

export const generateGraphData = (resData) => {
  if(resData.length === 0) return null;
  const lines = generateLines(resData);
  // if there is no available lines, should not show the graph
  if(lines.length === 0) {
    return null;
  }
  return {
    xAxis: resData.map(d => d.day),
    yRange: _generateYRange(resData),
    lines,
    yFormat: '$,.2s',
    xFormat: '%Y-%m-%d'
  };
};