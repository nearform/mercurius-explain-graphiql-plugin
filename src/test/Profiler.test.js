import { render, screen, act, fireEvent } from '@testing-library/react'
import { explainDataManager } from '../graphiql-explain/ExplainDataManager'
import { Profiler } from '../graphiql-explain/components/Profiler'
import { data } from './mocks'

const DATA_TEST_ID_OPEN_WATERFALL_VIEW = 'open-profiler-waterfall-chart'
const DATA_TEST_ID_WATERFALL_CHART = 'waterfall-chart'

describe('Profiler Waterfall View', () => {
  beforeEach(() => {
    act(() => {
      explainDataManager.setExplain({
        profiler: data.extensions.explain.profiler.data
      })
    })
  })

  it('should not display view opener icon if  profielr data is not available', () => {
    const { rerender } = render(<Profiler />)
    act(() => {
      explainDataManager.setExplain({
        profiler: []
      })
    })

    rerender(<Profiler />)

    const chartIconContainer = screen.queryByTestId(
      DATA_TEST_ID_OPEN_WATERFALL_VIEW
    )

    expect(chartIconContainer).not.toBeInTheDocument()
  })

  it('should display view opener icon if data is availavle', () => {
    render(<Profiler />)

    const chartIconContainer = screen.queryByTestId(
      DATA_TEST_ID_OPEN_WATERFALL_VIEW
    )

    expect(chartIconContainer).toBeInTheDocument()
  })

  it('should display svg element of waterfall chart on icon click', () => {
    render(<Profiler />)

    act(() => {
      explainDataManager.setExplain({
        profiler: data.extensions.explain.profiler.data
      })
    })

    const chartIconContainer = screen.queryByTestId(
      DATA_TEST_ID_OPEN_WATERFALL_VIEW
    )
    fireEvent.click(chartIconContainer)

    expect(screen.getByTestId(DATA_TEST_ID_WATERFALL_CHART)).toBeInTheDocument()
  })
})
