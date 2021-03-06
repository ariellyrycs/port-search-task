import * as d3 from 'd3';


class D3Component {
  svg;
  containerEl;
  margin = {top: 10, right: 30, bottom: 30, left: 60};
  currencyFormat = d3.format('$,');
  dateFormat = d3.timeParse('%Y-%m-%d');
  width;
  heigth;
  xAxisLength;
  yAxisLength;

  constructor(containerEl, {width, height, data}) {
    
    this.containerEl = containerEl;
    this._updateSize({width, height});
    this._createContainer();
    this.updateLines(data);
  }

  _updateSize = ({height, width}) => {
    this.width = width;
    this.height = height;
    this.xAxisLength = width - this.margin.left - this.margin.right;
    this.yAxisLength = height - this.margin.top - this.margin.bottom;
  }

  _createContainer = () => {
    this.svg = d3.select(this.containerEl)
      .append('svg')
        .attr('width', this.width)
        .attr('height', this.height)
      .append('g')
        .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  }

  _updateContainerSize = () => {
    this.svg.selectChild('svg')
      .attr('width', this.width)
      .attr('height', this.height);
  }
  
  updateLines = (dataProp = []) => {
    this.data = dataProp;
    this.svg.html('');
    const data = dataProp.map(d => ({
      day: this.dateFormat(d.day),
      mean: d.mean,
      low: d.low,
      high: d.high
    })),
      filteredMean = data.filter(d => d.mean !== null)
        .map(({mean, day}) => ({day, dataPoint: mean})),
      filteredLow = data.filter(d => d.low !== null)
        .map(({low, day}) => ({day, dataPoint: low})),
      filteredHigh = data.filter(d => d.high !== null)
        .map(({high, day}) => ({day, dataPoint: high}));

    var x = d3.scaleTime()
      .domain(d3.extent(data, ({day}) => day))
      .range([ 0, this.xAxisLength ]);

    this.svg.append('g')
      .attr('transform', `translate(0,${this.yAxisLength})`)
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([
        d3.min(data, function(d) {
          const min = Math.min(d.mean, d.low, d.high);
          return min - (min * 0.3);
        }),
        d3.max(data, function(d) {
          const max = Math.max(d.mean, d.low, d.high);
          return max + (max * 0.3);
        })
      ])
      .range([ this.yAxisLength, 0 ]);
    this.svg.append('g')
      .call(d3.axisLeft(y));

    // Add the line
    if(filteredMean.length > 0) {
      this._loadLine(filteredMean, x, y);
    }
    if(filteredLow.length > 0) {
      this._loadLine(filteredLow, x, y);
    }
    if(filteredHigh.length > 0) {
      this._loadLine(filteredHigh, x, y);
    }
  }

  _loadLine = (data, x, y) => {
    this.svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', d3.line()
        .x(({day}) => x(day))
        .y(({dataPoint}) => y(dataPoint))
      );
  }

  resize = ({width, height}) => {
    this._updateSize({width, height});
    this._updateContainerSize();
    //this._createContainer();
    this.updateLines(this.data);
  }
}

export default D3Component;