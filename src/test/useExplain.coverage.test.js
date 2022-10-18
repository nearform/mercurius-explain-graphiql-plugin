import { useExplain } from '../graphiql-explain/useExplain'
import { act, renderHook } from '@testing-library/react'
import { explainDataManager } from '../graphiql-explain/ExplainDataManager'
import { data } from './mockData'
import { appendTotalsToExplainResponse } from '../graphiql-explain/utils'

describe('useExplain hook', () => {
  beforeAll(() => {
    jest.resetAllMocks()
  })
  it('useExplain hook init', () => {
    const view = renderHook(useExplain)
    expect(view.result.current.explain).toHaveLength(0)
    expect(view.result.current.pathOrder).toEqual(0)
    expect(view.result.current.timeOrder).toEqual(0)
    expect(view.result.current.totalOrder).toEqual(0)
  })

  it('useExplain hook change value', () => {
    const view = renderHook(useExplain)
    expect(view.result.current.explain).toHaveLength(0)
    act(() => {
      explainDataManager.setExplain(data.extensions.explain.profiler.data)
    })
    view.rerender()
    expect(view.result.current.explain).not.toHaveLength(0)
    expect(view.result.current.explain).toEqual([
      {
        path: 'users',
        begin: 2180524057777125,
        end: 2180524359067041,
        time: 301289916,
        totalBegin: 2180524057777125,
        totalEnd: 2180524560907916,
        totalTime: 503130791
      },
      {
        path: 'users.0.addresses',
        begin: 2180524359216958,
        end: 2180524480481083,
        time: 121264125,
        totalBegin: 2180524359216958,
        totalEnd: 2180524480481083,
        totalTime: 121264125
      },
      {
        path: 'users.1.addresses',
        begin: 2180524359351708,
        end: 2180524480591458,
        time: 121239750,
        totalBegin: 2180524359351708,
        totalEnd: 2180524480591458,
        totalTime: 121239750
      },
      {
        path: 'users.0.status',
        begin: 2180524359295541,
        end: 2180524560765875,
        time: 201470334,
        totalBegin: 2180524359295541,
        totalEnd: 2180524560765875,
        totalTime: 201470334
      },
      {
        path: 'users.1.status',
        begin: 2180524359356041,
        end: 2180524560907916,
        time: 201551875,
        totalBegin: 2180524359356041,
        totalEnd: 2180524560907916,
        totalTime: 201551875
      }
    ])
  })

  it("useExplain should change the timeOrder to 1 if it's not set", () => {
    const view = renderHook(useExplain)
    act(() => {
      explainDataManager.setExplain(data.extensions.explain.profiler.data)
    })
    view.rerender()
    act(() => {
      view.result.current.changeTimeOrder()
    })
    view.rerender()
    expect(view.result.current.timeOrder).toEqual(1)
    expect(view.result.current.pathOrder).toEqual(0)
    expect(view.result.current.totalOrder).toEqual(0)
    expect(view.result.current.explain).toEqual([
      {
        path: 'users.1.addresses',
        begin: 2180524359351708,
        end: 2180524480591458,
        time: 121239750,
        totalBegin: 2180524359351708,
        totalEnd: 2180524480591458,
        totalTime: 121239750
      },
      {
        path: 'users.0.addresses',
        begin: 2180524359216958,
        end: 2180524480481083,
        time: 121264125,
        totalBegin: 2180524359216958,
        totalEnd: 2180524480481083,
        totalTime: 121264125
      },
      {
        path: 'users.0.status',
        begin: 2180524359295541,
        end: 2180524560765875,
        time: 201470334,
        totalBegin: 2180524359295541,
        totalEnd: 2180524560765875,
        totalTime: 201470334
      },
      {
        path: 'users.1.status',
        begin: 2180524359356041,
        end: 2180524560907916,
        time: 201551875,
        totalBegin: 2180524359356041,
        totalEnd: 2180524560907916,
        totalTime: 201551875
      },
      {
        path: 'users',
        begin: 2180524057777125,
        end: 2180524359067041,
        time: 301289916,
        totalBegin: 2180524057777125,
        totalEnd: 2180524560907916,
        totalTime: 503130791
      }
    ])
  })

  it("useExplain should change the timeOrder to -1 if it's already set", () => {
    const view = renderHook(useExplain)
    act(() => {
      explainDataManager.setExplain(data.extensions.explain.profiler.data)
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
    expect(view.result.current.explain).toEqual([
      {
        path: 'users',
        begin: 2180524057777125,
        end: 2180524359067041,
        time: 301289916,
        totalBegin: 2180524057777125,
        totalEnd: 2180524560907916,
        totalTime: 503130791
      },
      {
        path: 'users.1.status',
        begin: 2180524359356041,
        end: 2180524560907916,
        time: 201551875,
        totalBegin: 2180524359356041,
        totalEnd: 2180524560907916,
        totalTime: 201551875
      },
      {
        path: 'users.0.status',
        begin: 2180524359295541,
        end: 2180524560765875,
        time: 201470334,
        totalBegin: 2180524359295541,
        totalEnd: 2180524560765875,
        totalTime: 201470334
      },
      {
        path: 'users.0.addresses',
        begin: 2180524359216958,
        end: 2180524480481083,
        time: 121264125,
        totalBegin: 2180524359216958,
        totalEnd: 2180524480481083,
        totalTime: 121264125
      },
      {
        path: 'users.1.addresses',
        begin: 2180524359351708,
        end: 2180524480591458,
        time: 121239750,
        totalBegin: 2180524359351708,
        totalEnd: 2180524480591458,
        totalTime: 121239750
      }
    ])
  })

  it("useExplain should change the pathOrder to 1 if it's not set", () => {
    const view = renderHook(useExplain)
    act(() => {
      view.result.current.changePathOrder()
    })
    view.rerender()
    view.rerender()
    expect(view.result.current.timeOrder).toEqual(0)
    expect(view.result.current.totalOrder).toEqual(0)
    expect(view.result.current.pathOrder).toEqual(1)
  })

  it("useExplain should change the pathOrder to -1 if it's already set", () => {
    const view = renderHook(useExplain)
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

  it("useExplain should change the totalOrder to 1 if it's not set", () => {
    const view = renderHook(useExplain)
    act(() => {
      view.result.current.changeTotalOrder()
    })
    view.rerender()
    view.rerender()
    expect(view.result.current.timeOrder).toEqual(0)
    expect(view.result.current.totalOrder).toEqual(1)
    expect(view.result.current.pathOrder).toEqual(0)
  })

  it("useExplain should change the totalOrder to -1 if it's already set", () => {
    const view = renderHook(useExplain)
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

  it('useExplain should filter the results by the searchQuery', () => {
    const view = renderHook(useExplain)
    act(() => {
      explainDataManager.setExplain(
        data.extensions.explain.profiler.data.filter(e =>
          e.path.includes('status')
        )
      )
    })
    view.rerender()
    act(() => {
      view.result.current.searchByPath({ target: { value: '0' } })
    })
    expect(view.result.current.explain).toEqual(
      appendTotalsToExplainResponse(
        data.extensions.explain.profiler.data
      ).filter(e => e.path.includes('0.status'))
    )
  })

  it('useExplain should return and empty array if the paths does not contain the search query', () => {
    const view = renderHook(useExplain)
    act(() => {
      explainDataManager.setExplain(data.extensions.explain.profiler.data)
    })
    view.rerender()
    act(() => {
      view.result.current.searchByPath({ target: { value: '------' } })
    })
    view.rerender()
    expect(view.result.current.explain).toHaveLength(0)
  })

  it('useExplain should return the initial array if the search query is empty', () => {
    const view = renderHook(useExplain)
    act(() => {
      explainDataManager.setExplain(data.extensions.explain.profiler.data)
    })
    view.rerender()
    act(() => {
      view.result.current.searchByPath({ target: { value: '' } })
    })
    view.rerender()
    expect(view.result.current.explain).toHaveLength(5)
  })
})
