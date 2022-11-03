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
import { useWindowSize } from '../hooks/useWindowResize'
import { ReactComponent as ArrowIcon } from '../../icons/arrow.svg'
import styles from './WaterfallChart.module.css'
import tooltipStyles from './Tooltip.module.css'
import { textShortener } from '../utils/index'

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

const getFormattedNumber = numberMs => {
  return `${format(`0.3f`)(numberMs)} ms`
}

export const WaterfallChart = ({ data, limits, filters }) => {
  const { width: windowInnerWidth = window.innerWidth } = useWindowSize()
  const chartRef = useRef(null)
  const marginChartRef = useRef(null)
  const xAxisRef = useRef(null)
  const yAxisRef = useRef(null)
  const dataRef = useRef(null)
  const toolTipRef = useRef(null)

  const neededMarginLeft = CHARACTER_WIDTH_MONO_SIZE_12 * limits.pathLength + 15
  const marginLeft = Math.min(...[neededMarginLeft, MAX_MARGIN_LEFT])

  const { dimensions, margins } = useMemo(() => {
    const margins = {
      top: 50,
      right: 60,
      left: marginLeft,
      bottom: 30
    }
    return {
      dimensions: {
        width: windowInnerWidth * 0.8,
        height: data.length * 30 + margins.top + margins.bottom
      },
      margins
    }
  }, [data, windowInnerWidth, marginLeft])

  const innerWidth = dimensions.width - margins.left - margins.right
  const innerHeight = dimensions.height - margins.top - margins.bottom

  const xScale = scaleLinear()
    .domain([0, limits.totalTime])
    .range([0, innerWidth])
    .nice()

  const yScale = scaleBand()
    .domain(data.map(({ path }) => path))
    .range([0, innerHeight])
    .paddingInner(0.1)

  useEffect(() => {
    const maxCharactersToDisplay =
      Math.floor(marginLeft / CHARACTER_WIDTH_MONO_SIZE_12) - 1
    let tooltip = select(toolTipRef.current)
    select(chartRef.current)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)

    select(marginChartRef.current)
      .attr('transform', `translate(${margins.left},${margins.top})`)
      .selectAll('text')
      .attr('fill', '#000')

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
          .tickFormat(x => getFormattedNumber(x * 1e-6))
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
      .each(function (text) {
        const shortenedPath = textShortener(text, maxCharactersToDisplay)
        select(this).text(shortenedPath)
      })
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
              `${colorLegend[key].label} - ${getFormattedNumber(
                d.data[key] * 1e-6
              )}</br>`
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
  }, [
    data,
    xScale,
    yScale,
    innerHeight,
    dimensions,
    limits,
    margins,
    marginLeft
  ])

  return (
    <>
      <div className={styles.header}>
        <div className={styles.subheadersContainer}>
          {filters.map(({ onClick, order, label }) => {
            return (
              <div
                key={label}
                onClick={onClick}
                className={`${styles.subheaderContainer} ${styles.pointer}`}
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
