import React, { useRef, useEffect, useMemo } from 'react'
import {
  select,
  axisTop,
  scaleLinear,
  scaleBand,
  axisLeft,
  format,
  stack
} from 'd3'
import { Tooltip } from './Tooltip'
import { ReactComponent as ArrowIcon } from '../../icons/arrow.svg'
import styles from './WaterfallChart.module.css'
import tooltipStyles from './Tooltip.module.css'

const BAR_SPACING = 7
const CHARACTER_WIDTH_MONO_SIZE_12 = 7.204
const MAX_MARGIN_LEFT = 230

const colorLegend = {
  time: {
    color: '#1f990f',
    borderColor: '#1f990f',
    label: 'Time'
  },
  totalTime: {
    color: '#3058d1',
    borderColor: '#3058d1',
    label: 'Total Time'
  }
}

const dataToStack = data => {
  const stacker = stack().keys(['totalTime', 'time'])
  return stacker(data)
}

const normalize = (data, minBegin) => {
  return data.map(datum => ({
    ...datum,
    relativeBegin: datum.totalBegin - minBegin
  }))
}

export const WaterfallChart = ({ data, limits, filters }) => {
  const chartRef = useRef(null)
  const marginChartRef = useRef(null)
  const xAxisRef = useRef(null)
  const yAxisRef = useRef(null)
  const dataRef = useRef(null)
  const toolTipRef = useRef(null)

  const { dimensions, margins } = useMemo(() => {
    const marginLeft = Math.min(
      ...[
        CHARACTER_WIDTH_MONO_SIZE_12 * limits.pathLength + 15,
        MAX_MARGIN_LEFT
      ]
    )

    return {
      dimensions: { width: window.innerWidth * 0.8, height: data.length * 30 },
      margins: {
        top: 50,
        right: 60,
        left: marginLeft,
        bottom: 30
      }
    }
  }, [data, limits])

  const innerWidth = dimensions.width - margins.left - margins.right
  const innerHeight = dimensions.height - margins.top - margins.bottom

  const xScale = scaleLinear()
    .domain([0, limits.totalTime])
    .range([0, innerWidth])
    .nice()

  const yScale = scaleBand()
    .domain(data.map(datum => datum.path))
    .range([0, innerHeight])
    .paddingInner(0.1)

  useEffect(() => {
    let tooltip = select(toolTipRef.current)
    select(chartRef.current)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)

    select(marginChartRef.current)
      .attr('transform', `translate(${margins.left},${margins.top})`)
      .selectAll('text')
      .attr('color', '#000')

    const xAxisGroup = select(xAxisRef.current)
    xAxisGroup
      .selectAll('line')
      .attr('transform', `translate(0,-5)`)
      .attr('stroke-width', '0.5px')
      .attr('stroke', '#000')
    xAxisGroup.selectAll('.domain').attr('stroke', '#000')
    xAxisGroup
      .call(
        axisTop(xScale)
          .tickFormat(x => `${format('0.1f')(x * 1e-6)} ms`)
          .tickSize(-innerHeight - 15)
          .tickPadding(10)
      )
      .selectAll('text')
      .attr('transform', 'rotate(-30) translate(15, -1)')

    const yAxisGroup = select(yAxisRef.current)
    yAxisGroup.selectAll('.domain').attr('stroke', '#000')
    yAxisGroup.selectAll('line').attr('stroke', '#000')
    yAxisGroup
      .call(axisLeft(yScale))
      .selectAll('text')
      .attr('font-size', 12)
      .attr('font-family', 'monospace')
      .select('.domain')
      .attr('stroke', '#000')

    const stackedData = dataToStack(normalize(data, limits.totalBegin))

    const dataGroup = select(dataRef.current)

    const barGroups = dataGroup
      .selectAll('g')
      .data(stackedData)
      .join('g')
      .attr('fill', ({ key }) => colorLegend[key].color)
      .attr('stroke', ({ key }) => colorLegend[key].borderColor)
      .attr('stroke-width', '1px')

    const rect = barGroups
      .selectAll('rect')
      .data(d => d)
      .join('rect')

    rect
      .transition()
      .attr('rx', 3)
      .attr('x', d => xScale(d.data.relativeBegin))
      .attr('y', d => yScale(d.data.path))
      .attr('height', yScale.bandwidth() - BAR_SPACING)
      .attr('width', ([start, end]) => xScale(end) - xScale(start))
      .attr('transform', `translate(2,${BAR_SPACING / 2})`)
      .attr('pointer-events', 'all')

    rect
      .on('mouseover', function (_, d) {
        select(this).style('opacity', 0.7)
        tooltip.style('opacity', 1)
        tooltip.select(`.${tooltipStyles.content}`).text('')
        tooltip
          .select(`.${tooltipStyles.content}`)
          .append('span')
          .html(`Path - ${d.data.path}</br>`)
        Object.keys(colorLegend).forEach(key => {
          tooltip
            .select(`.${tooltipStyles.content}`)
            .append('span')
            .html(
              `${colorLegend[key].label} - ${format('0.2f')(
                d.data[key] * 1e-6
              )} ms</br>`
            )
        })
      })
      .on('mouseout', function () {
        tooltip.style('opacity', 0)
        select(this).style('opacity', 1)
      })
      .on('mousemove', ({ clientX, clientY }) => {
        tooltip.style('left', `${clientX}px`)
        tooltip.style('top', `${clientY}px`)
      })
  }, [data, xScale, yScale, innerHeight, dimensions, limits, margins])

  return (
    <>
      <div className={styles.header}>
        <div className={styles.subheadersContainer}>
          {filters.map(({ onClick, order, label }) => {
            return (
              <div
                key={label}
                onClick={onClick}
                className={styles.subheaderContainer}
              >
                {order !== 0 && (
                  <ArrowIcon
                    fill="currentColor"
                    className={`${styles.arrow} ${
                      order > 0 ? styles.rotate180 : ''
                    }`}
                    alt={`arrow-${order > 0 ? 'up' : 'down'}`}
                  />
                )}
                <p className={styles.subheaderLabel}>{label}</p>
              </div>
            )
          })}
        </div>
        <h3 className={styles.chartTitle}>Profiler Waterfall View</h3>
        <div className={styles.subheadersContainer}>
          {Object.values(colorLegend).map(({ color, label }) => (
            <div key={label} className={styles.subheaderContainer}>
              <p className={styles.subheaderLabel}>{label}</p>
              <div
                className={styles.colorSquare}
                style={{ backgroundColor: color }}
              />
            </div>
          ))}
        </div>
      </div>

      <svg ref={chartRef} data-testid="waterfall-chart">
        <g ref={marginChartRef}>
          <g ref={xAxisRef} />
          <g ref={yAxisRef} />
          <g ref={dataRef} />
        </g>
      </svg>
      <Tooltip ref={toolTipRef} />
    </>
  )
}
