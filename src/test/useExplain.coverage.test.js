import { useExplain } from '../graphiql-explain/useExplain'
import { act, renderHook } from '@testing-library/react'
import { explainDataManager } from '../graphiql-explain/ExplainDataManager'
import { data } from './mockData'

describe('useExplain hook', () => {
  beforeAll(() => {
    jest.resetAllMocks()
  })
  it('useExplain hook init', () => {
    const view = renderHook(useExplain)
    expect(view.result.current.explain).toHaveLength(0)
    expect(view.result.current.pathOrder).toEqual(0)
    expect(view.result.current.timeOrder).toEqual(0)
  })

  it('useExplain hook change value', () => {
    const view = renderHook(useExplain)
    expect(view.result.current.explain).toHaveLength(0)
    act(() => {
      explainDataManager.setExplain(data.extensions.explain)
    })
    view.rerender()
    expect(view.result.current.explain).not.toHaveLength(0)
    expect(view.result.current.explain).toEqual(data.extensions.explain)
  })

  it("useExplain should change the timeOrder to 1 if it's not set", () => {
    const view = renderHook(useExplain)
    act(() => {
      view.result.current.changeTimeOrder()
    })
    view.rerender()
    expect(view.result.current.timeOrder).toEqual(1)
    expect(view.result.current.pathOrder).toEqual(0)
  })

  it("useExplain should change the timeOrder to -1 if it's already set", () => {
    const view = renderHook(useExplain)
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
  })

  it("useExplain should change the pathOrder to 1 if it's not set", () => {
    const view = renderHook(useExplain)
    act(() => {
      view.result.current.changePathOrder()
    })
    view.rerender()
    view.rerender()
    expect(view.result.current.timeOrder).toEqual(0)
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
    expect(view.result.current.timeOrder).toEqual(0)
    expect(view.result.current.pathOrder).toEqual(-1)
  })

  it('useExplain should filter the results by the searchQuery', () => {
    const view = renderHook(useExplain)
    act(() => {
      explainDataManager.setExplain(
        data.extensions.explain.filter(e => e.path.includes('status'))
      )
    })
    view.rerender()
    act(() => {
      view.result.current.searchByPath({ target: { value: '0' } })
    })
    expect(view.result.current.explain).toEqual(
      data.extensions.explain.filter(e => e.path.includes('0.status'))
    )
  })

  it('useExplain should return and empty array if the paths does not contain the search query', () => {
    const view = renderHook(useExplain)
    act(() => {
      explainDataManager.setExplain(data.extensions.explain)
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
      explainDataManager.setExplain(data.extensions.explain)
    })
    view.rerender()
    act(() => {
      view.result.current.searchByPath({ target: { value: '' } })
    })
    view.rerender()
    expect(view.result.current.explain).toHaveLength(5)
  })
})
