import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { debounce } from 'throttle-debounce';

class D3Component {
  containerEl;
  margin = {top: 10, right: 30, bottom: 30, left: 60};
  currencyFormat;
  dateFormat;
  width;
  heigth;
  xAxisLength;
  yAxisLength;
  innerContainer;
  svg;

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
      .append('svg');
    this.innerContainer = this.svg
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
    this._updateContainerSize();
  }

  _updateContainerSize = () => {
    this.svg
      .attr('width', this.width)
      .attr('height', this.height);
  }
  
  updateLines = (dataProp) => {
    this.data = dataProp;
    this.currencyFormat = d3.format(this.data.yFormat);
    this.dateFormat = d3.timeParse(this.data.xFormat);
    this.innerContainer.html('');

    var x = d3.scaleTime()
      .domain(d3.extent(this.data.xAxis, (xItem) => this.dateFormat(xItem)))
      .range([0, this.xAxisLength]);

    this.innerContainer.append('g')
      .attr('transform', `translate(0,${this.yAxisLength})`)
      .call(d3.axisBottom(x).ticks(this.xAxisLength / 100));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain(this.data.yRange)
      .range([this.yAxisLength, 0 ]);

    this.innerContainer.append('g')
      .call(d3.axisLeft(y).ticks(10, this.currencyFormat));

    // Add the line
    for(let item of this.data.lines) {
      this._loadLine(item, x, y);
    }

    this._addDescription(dataProp);
  }

  _loadLine = (line, xLine, yLine) => {
    this.innerContainer.append('path')
      .datum(line.data)
      .attr('fill', 'none')
      .attr('stroke', line.color)
      .attr('stroke-width', 3)
      .attr('d', d3.line()
        .x(({x}) => xLine(this.dateFormat(x)))
        .y(({y}) => yLine(y))
      );
  }

  _addDescription = (data) => {
    const textContainer = this.svg.append('g')
      .attr('text-anchor', 'start')
      .attr('transform', `translate(${this.margin.left + 20},20)`);
    data.lines.forEach(({color, label}, i) => {
      const text = textContainer.append('text')
        .attr('transform', `translate(0, ${20 * i})`);
      text.append('tspan').text('----   ')
        .attr('stroke', color)
        .attr('stroke-width', 3)
      text.append('tspan')
        .text(label)
        .attr('stroke-width', 2);
    });
  }

  resize = ({width, height}) => {
    this._updateSize({width, height});
    this._updateContainerSize();
    this.updateLines(this.data);
  }
}

let vis = null;

export default function LineGraph ({data, className}) {
  const graphContainerRef = useRef(null);

  useEffect(() => {
    if(data) {
      if(vis) {
        vis.updateLines(data);
      } else {
        const currElement = graphContainerRef.current;
        vis = new D3Component(currElement, {
          data,
          width: currElement.offsetWidth,
          height: currElement.offsetHeight,
        });
      }
    }
  }, [ data ]);

  useEffect(() => {
    const handleResize = debounce(500, () => {
      const currElement = graphContainerRef.current;
      vis.resize({
        width: currElement.offsetWidth,
        height: currElement.offsetHeight,
      })
    });
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return <div ref={graphContainerRef} className={className}></div>
}