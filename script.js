// File: script.js
const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

fetch(url)
  .then(response => response.json())
  .then(data => {
    const dataset = data.data;
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 60, left: 80 };
    const barWidth = (width - margin.left - margin.right) / dataset.length;

    const xScale = d3.scaleTime()
      .domain([new Date(dataset[0][0]), new Date(dataset[dataset.length - 1][0])])
      .range([0, width - margin.left - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset, d => d[1])])
      .range([height - margin.top - margin.bottom, 0]);

    const svg = d3.select('#gdp-chart')
      .attr('width', width)
      .attr('height', height);

    const chart = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', margin.top)
      .attr('text-anchor', 'middle')
      .attr('id', 'title')
      .text('US GDP Over Time');

    // X Axis
    const xAxis = d3.axisBottom(xScale)
      .ticks(d3.timeYear.every(5))
      .tickFormat(d3.timeFormat('%Y'));

    chart.append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
      .call(xAxis);

    // Y Axis
    const yAxis = d3.axisLeft(yScale)
      .ticks(10)
      .tickFormat(d3.format('.0s'));

    chart.append('g')
      .attr('id', 'y-axis')
      .call(yAxis);

    // Bars
    chart.selectAll('rect')
      .data(dataset)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('data-date', d => d[0])
      .attr('data-gdp', d => d[1])
      .attr('x', d => xScale(new Date(d[0])))
      .attr('y', d => yScale(d[1]))
      .attr('width', barWidth)
      .attr('height', d => height - margin.top - margin.bottom - yScale(d[1]))
