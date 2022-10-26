import { useProfiler } from '../graphiql-explain/hooks/useProfiler'
import { act, renderHook } from '@testing-library/react'
import { explainDataManager } from '../graphiql-explain/ExplainDataManager'
import { data, simplifiedData } from './mocks'
import { appendTotalsToExplainResponse } from '../graphiql-explain/utils'

describe('useProfiler hook', () => {
  beforeAll(() => {
    jest.resetAllMocks()
  })

  it('useProfiler hook init', () => {
    const view = renderHook(useProfiler)

    expect(view.result.current.profiler).toHaveLength(0)
    expect(view.result.current.pathOrder).toEqual(0)
    expect(view.result.current.timeOrder).toEqual(0)
    expect(view.result.current.totalOrder).toEqual(0)
  })

  it('useProfiler hook change value', () => {
    const view = renderHook(useProfiler)

    expect(view.result.current.profiler).toHaveLength(0)

    act(() => {
      explainDataManager.setExplain({
        profiler: simplifiedData.extensions.explain.profiler.data
      })
    })
    view.rerender()

    expect(view.result.current.profiler).not.toHaveLength(0)
    expect(view.result.current.profiler).toEqual([
      {
        begin: 1,
        end: 2,
        path: 'users',
        time: 1,
        totalBegin: 1,
        totalEnd: 5,
        totalTime: 4
      },
      {
        begin: 3,
        end: 4,
        path: 'users.0.addresses',
        time: 1,
        totalBegin: 3,
        totalEnd: 4,
        totalTime: 1
      },
      {
        begin: 2,
        end: 4,
        path: 'users.1.addresses',
        time: 2,
        totalBegin: 2,
        totalEnd: 4,
        totalTime: 2
      },
      {
        begin: 2,
        end: 3,
        path: 'users.0.status',
        time: 1,
        totalBegin: 2,
        totalEnd: 3,
        totalTime: 1
      },
      {
        begin: 2,
        end: 5,
        path: 'users.1.status',
        time: 3,
        totalBegin: 2,
        totalEnd: 5,
        totalTime: 3
      }
    ])
  })

  it("useProfiler should change the timeOrder to 1 if it's not set", () => {
    const view = renderHook(useProfiler)

    act(() => {
      explainDataManager.setExplain({
        profiler: simplifiedData.extensions.explain.profiler.data
      })
    })
    view.rerender()

    act(() => {
      view.result.current.changeTimeOrder()
    })
    view.rerender()

    expect(view.result.current.timeOrder).toEqual(1)
    expect(view.result.current.pathOrder).toEqual(0)
    expect(view.result.current.totalOrder).toEqual(0)
    expect(view.result.current.profiler).toEqual([
      {
        begin: 1,
        end: 2,
        path: 'users',
        time: 1,
        totalBegin: 1,
        totalEnd: 5,
        totalTime: 4
      },
      {
        begin: 3,
        end: 4,
        path: 'users.0.addresses',
        time: 1,
        totalBegin: 3,
        totalEnd: 4,
        totalTime: 1
      },
      {
        begin: 2,
        end: 3,
        path: 'users.0.status',
        time: 1,
        totalBegin: 2,
        totalEnd: 3,
        totalTime: 1
      },
      {
        begin: 2,
        end: 4,
        path: 'users.1.addresses',
        time: 2,
        totalBegin: 2,
        totalEnd: 4,
        totalTime: 2
      },
      {
        begin: 2,
        end: 5,
        path: 'users.1.status',
        time: 3,
        totalBegin: 2,
        totalEnd: 5,
        totalTime: 3
      }
    ])
  })

  it("useProfiler should change the timeOrder to -1 if it's already set", () => {
    const view = renderHook(useProfiler)

    act(() => {
      explainDataManager.setExplain({
        profiler: simplifiedData.extensions.explain.profiler.data
      })
    })
    view.rerender()

    act(() => {
      view.result.current.changeTimeOrder()
    })
    view.rerender()

    act(() => {
      view.result.current.changeTimeOrder()
    })
    view.rerender()

    expect(view.result.current.timeOrder).toEqual(-1)
    expect(view.result.current.pathOrder).toEqual(0)
    expect(view.result.current.totalOrder).toEqual(0)
    expect(view.result.current.profiler).toEqual([
      {
        begin: 2,
        end: 5,
        path: 'users.1.status',
        time: 3,
        totalBegin: 2,
        totalEnd: 5,
        totalTime: 3
      },
      {
        begin: 2,
        end: 4,
        path: 'users.1.addresses',
        time: 2,
        totalBegin: 2,
        totalEnd: 4,
        totalTime: 2
      },
      {
        begin: 1,
        end: 2,
        path: 'users',
        time: 1,
        totalBegin: 1,
        totalEnd: 5,
        totalTime: 4
      },
      {
        begin: 3,
        end: 4,
        path: 'users.0.addresses',
        time: 1,
        totalBegin: 3,
        totalEnd: 4,
        totalTime: 1
      },
      {
        begin: 2,
        end: 3,
        path: 'users.0.status',
        time: 1,
        totalBegin: 2,
        totalEnd: 3,
        totalTime: 1
      }
    ])
  })

  it("useProfiler should change the pathOrder to 1 if it's not set", () => {
    const view = renderHook(useProfiler)

    act(() => {
      view.result.current.changePathOrder()
    })
    view.rerender()

    expect(view.result.current.timeOrder).toEqual(0)
    expect(view.result.current.totalOrder).toEqual(0)
    expect(view.result.current.pathOrder).toEqual(1)
  })

  it("useProfiler should change the pathOrder to -1 if it's already set", () => {
    const view = renderHook(useProfiler)

    act(() => {
      view.result.current.changePathOrder()
    })
    view.rerender()

    act(() => {
      view.result.current.changePathOrder()
    })
    view.rerender()

    expect(view.result.current.totalOrder).toEqual(0)
    expect(view.result.current.timeOrder).toEqual(0)
    expect(view.result.current.pathOrder).toEqual(-1)
  })

  it("useProfiler should change the totalOrder to 1 if it's not set", () => {
    const view = renderHook(useProfiler)

    act(() => {
      view.result.current.changeTotalOrder()
    })
    view.rerender()

    expect(view.result.current.timeOrder).toEqual(0)
    expect(view.result.current.totalOrder).toEqual(1)
    expect(view.result.current.pathOrder).toEqual(0)
  })

  it("useProfiler should change the totalOrder to -1 if it's already set", () => {
    const view = renderHook(useProfiler)

    act(() => {
      view.result.current.changeTotalOrder()
    })
    view.rerender()

    act(() => {
      view.result.current.changeTotalOrder()
    })
    view.rerender()

    expect(view.result.current.totalOrder).toEqual(-1)
    expect(view.result.current.timeOrder).toEqual(0)
    expect(view.result.current.pathOrder).toEqual(0)
  })

  it('useProfiler should filter the results by the searchQuery', () => {
    const view = renderHook(useProfiler)

    act(() => {
      explainDataManager.setExplain({
        profiler: data.extensions.explain.profiler.data.filter(e =>
          e.path.includes('status')
        )
      })
    })
    view.rerender()

    act(() => {
      view.result.current.searchByPath({ target: { value: '0' } })
    })

    expect(view.result.current.profiler).toEqual(
      appendTotalsToExplainResponse(
        data.extensions.explain.profiler.data
      ).filter(e => e.path.includes('0.status'))
    )
  })

  it('useProfiler should return and empty array if the paths does not contain the search query', () => {
    const view = renderHook(useProfiler)

    act(() => {
      explainDataManager.setExplain({
        profiler: data.extensions.explain.profiler.data
      })
    })
    view.rerender()

    act(() => {
      view.result.current.searchByPath({ target: { value: '------' } })
    })
    view.rerender()

    expect(view.result.current.profiler).toHaveLength(0)
  })

  it('useProfiler should return the initial array if the search query is empty', () => {
    const view = renderHook(useProfiler)

    act(() => {
      explainDataManager.setExplain({
        profiler: data.extensions.explain.profiler.data
      })
    })
    view.rerender()

    act(() => {
      view.result.current.searchByPath({ target: { value: '' } })
    })
    view.rerender()

    expect(view.result.current.profiler).toHaveLength(5)
  })
})
