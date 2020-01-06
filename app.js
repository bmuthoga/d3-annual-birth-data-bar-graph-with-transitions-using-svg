window.addEventListener('DOMContentLoaded', () => {
  let minYear = d3.min(birthData, d => d.year)
  let maxYear = d3.max(birthData, d => d.year)
  let width = 600
  let height = 600
  let barPadding = 10
  let numOfBars = 12
  let barWidth = width / numOfBars - barPadding
  let maxBirths = d3.max(birthData, d => d.births)
  let yScale = d3.scaleLinear()
                  .domain([0, maxBirths])
                  .range([height, 0])

  d3.select('input')
    .property('min', minYear)
    .property('max', maxYear)
    .property('value', minYear)
    .on('input', () => {
      let year = +d3.event.target.value

      d3.selectAll('rect')
        .data(birthData.filter(d => d.year === year))
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .delay((d, i) => i * 250)
        .on('start', (d, i) => {
          if (i === 0) {
            d3.select('.title')
              .text(`Updating to ${year} data...`)
          }
        })
        .on('end', (d, i, nodes) => {
          if (i === nodes.length - 1) {
            d3.select('.title')
              .text(`Birth Data in ${year}`)
          }
        })
        .on('interrupt', () => console.log(`Interrupted! No longer updating to ${year} data...`))
          .attr('height', d => height - yScale(d.births))
          .attr('y', d => yScale(d.births))

      d3.select('h3')
        .text(year)
    })

  d3.select('svg')
      .attr('width', width)
      .attr('height', height)
    .selectAll('rect')
    .data(birthData.filter(obj => obj.year === minYear))
    .enter()
    .append('rect')
      .attr('width', barWidth)
      .attr('height', d => height - yScale(d.births))
      .attr('y', d => yScale(d.births))
      .attr('x', (d, idx) => (barWidth + barPadding) * idx)
      .attr('fill', 'purple')

  d3.select('svg')
    .append('text')
      .classed('title', true)
      .text(`Birth Data in ${minYear}`)
      .attr('x', width / 2)
      .attr('y', 30)
      .style('text-anchor', 'middle')
      .style('font-size', '2em')

  d3.select('h3')
    .text(minYear)
})
