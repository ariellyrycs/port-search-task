
const _generatePropLineFormat = (data, propName) =>
  data.filter(d => d[propName] !== null)
      .map((d) => ({x: d.day, y: d[propName]}));


const getPointsValues = (d) => {
  const values = [];
  if(d.low) values.push(d.low);
  if(d.high) values.push(d.high);
  if(d.mean) values.push(d.mean);
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

export const generateGraphData = (resData) => {
  if(resData.length === 0) return null

  return {
    xAxis: resData.map(d => d.day),
    yRange: _generateYRange(resData),
    lines: [{
      label: 'Mean',
      data: _generatePropLineFormat(resData, 'mean'),
      color: 'red'
    }, {
      label: 'Low',
      data: _generatePropLineFormat(resData, 'low'),
      color: 'blue'
    }, {
      label: 'High',
      data: _generatePropLineFormat(resData, 'high'),
      color: 'green'
    }],
    yFormat: '$,.2s',
    xFormat: '%Y-%m-%d'
  };
};