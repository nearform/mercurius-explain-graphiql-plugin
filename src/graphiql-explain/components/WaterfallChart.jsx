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

const BAR_SPACING = 15
const CHARACTER_WIDTH_MONO_SIZE_12 = 7.204
const MAX_MARGIN_LEFT = 230

const colorLegend = {
  time: {
    color: '#2BAB7C',
    borderColor: '#2BAB7C',
    label: 'Time'
  },
  totalTime: {
    color: '#007DEB',
    borderColor: '#007DEB',
    label: 'Total'
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
      top: 25,
      right: 60,
      left: marginLeft,
      bottom: 30
    }
    return {
      dimensions: {
        width: windowInnerWidth * 0.6,
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
    let tooltip = select(toolTipRef.current)
    select(chartRef.current)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)

    const isLight = !!document.querySelectorAll('.graphiql-light').length

    select(marginChartRef.current)
      .attr('transform', `translate(${margins.left},${margins.top})`)
      .selectAll('text')
      .attr('fill', isLight ? '#3B4B68' : '#B7C2D7')

    const xAxisGroup = select(xAxisRef.current)

    xAxisGroup.call(
      axisTop(xScale)
        .tickFormat(x => getFormattedNumber(x * 1e-6))
        .tickSize(-400)
        .tickPadding(10)
    )

    const yAxisGroup = select(yAxisRef.current)

    yAxisGroup.select('.domain').attr('opacity', 0)
    xAxisGroup.select('.domain').attr('opacity', 0)

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
      .attr('rx', 0)

    rect
      .transition()
      .attr('x', d => xScale(d.data.relativeBegin))
      .attr('y', d => yScale(d.data.path))
      .attr('height', yScale.bandwidth() - BAR_SPACING)
      .attr('width', ([start, end]) => xScale(end) - xScale(start))
      .attr('transform', `translate(2,${BAR_SPACING / 2})`)
      .attr('pointer-events', 'all')

    rect
      .on('mouseover', function (_, d) {
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
      <div className={styles.legendsContainer}>
        {Object.values(colorLegend).map(({ color, label }) => (
          <div key={label} className={styles.legendContainer}>
            <div
              className={styles.colorSquare}
              style={{ backgroundColor: color }}
            />
            <p className={styles.subheaderLabel}>{label}</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        <div className={styles.header}>
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
          {data.map(({ path, time, totalTime }) => {
            return (
              <React.Fragment key={`${totalTime}-${path}`}>
                <div
                  className={`${styles.subheaderContainer} ${styles.pointer}`}
                >
                  <p className={styles.subheaderLabel}>{path}</p>
                </div>
                <div
                  className={`${styles.subheaderContainer} ${styles.pointer}`}
                >
                  <p className={styles.subheaderLabel}>
                    {(time * 1e-6).toFixed(3)}
                  </p>
                </div>
                <div
                  className={`${styles.subheaderContainer} ${styles.pointer}`}
                >
                  <p className={styles.subheaderLabel}>
                    {(totalTime * 1e-6).toFixed(3)}
                  </p>
                </div>
              </React.Fragment>
            )
          })}
        </div>

        <svg ref={chartRef} data-testid="waterfall-chart">
          <g ref={marginChartRef}>
            <g ref={xAxisRef} />
            <g ref={yAxisRef} />
            <g ref={dataRef} />
          </g>
        </svg>
        <Tooltip ref={toolTipRef} />
      </div>
    </>
  )
}
