import { useResolverCalls } from '../graphiql-explain/hooks/useResolverCalls'
import { act, renderHook } from '@testing-library/react'
import { explainDataManager } from '../graphiql-explain/ExplainDataManager'
import { data } from './mocks'
import { resolverCallMapper } from '../graphiql-explain/utils'

describe('useResolverCalls hook', () => {
  beforeAll(() => {
    jest.resetAllMocks()
  })

  it('useResolverCalls hook init', () => {
    const view = renderHook(useResolverCalls)

    expect(view.result.current.resolverCalls).toHaveLength(0)
    expect(view.result.current.pathOrder).toEqual(0)
    expect(view.result.current.countOrder).toEqual(0)
  })

  it('useResolverCalls hook change value', () => {
    const view = renderHook(useResolverCalls)

    expect(view.result.current.resolverCalls).toHaveLength(0)

    act(() => {
      explainDataManager.setExplain({
        resolverCalls: data.extensions.explain.resolverCalls.data
      })
    })
    view.rerender()

    expect(view.result.current.resolverCalls).not.toHaveLength(0)
    expect(view.result.current.resolverCalls).toEqual([
      { count: 1, path: 'Query.users' },
      { count: 2, path: 'User.addresses' },
      { count: 2, path: 'User.status' }
    ])
  })

  it("useResolverCalls should change the countOrder to 1 if it's not set", () => {
    const view = renderHook(useResolverCalls)

    act(() => {
      explainDataManager.setExplain({
        resolverCalls: data.extensions.explain.resolverCalls.data
      })
    })
    view.rerender()

    act(() => {
      view.result.current.changeCountOrder()
    })
    view.rerender()

    expect(view.result.current.pathOrder).toEqual(0)
    expect(view.result.current.countOrder).toEqual(1)
    expect(view.result.current.resolverCalls).toEqual([
      { count: 1, path: 'Query.users' },
      { count: 2, path: 'User.addresses' },
      { count: 2, path: 'User.status' }
    ])
  })

  it("useResolverCalls should change the countOrder to -1 if it's already set", () => {
    const view = renderHook(useResolverCalls)

    act(() => {
      explainDataManager.setExplain({
        resolverCalls: data.extensions.explain.resolverCalls.data
      })
    })
    view.rerender()

    act(() => {
      view.result.current.changeCountOrder()
    })
    view.rerender()

    act(() => {
      view.result.current.changeCountOrder()
    })
    view.rerender()

    expect(view.result.current.countOrder).toEqual(-1)
    expect(view.result.current.pathOrder).toEqual(0)
    expect(view.result.current.resolverCalls).toEqual([
      { count: 2, path: 'User.addresses' },
      { count: 2, path: 'User.status' },
      { count: 1, path: 'Query.users' }
    ])
  })

  it("useResolverCalls should change the pathOrder to 1 if it's not set", () => {
    const view = renderHook(useResolverCalls)

    act(() => {
      view.result.current.changePathOrder()
    })
    view.rerender()

    expect(view.result.current.countOrder).toEqual(0)
    expect(view.result.current.pathOrder).toEqual(1)
  })

  it("useResolverCalls should change the pathOrder to -1 if it's already set", () => {
    const view = renderHook(useResolverCalls)

    act(() => {
      view.result.current.changePathOrder()
    })
    view.rerender()

    act(() => {
      view.result.current.changePathOrder()
    })
    view.rerender()

    expect(view.result.current.countOrder).toEqual(0)
    expect(view.result.current.pathOrder).toEqual(-1)
  })

  it('useResolverCalls should filter the results by the searchQuery', () => {
    const view = renderHook(useResolverCalls)

    act(() => {
      explainDataManager.setExplain({
        resolverCalls: data.extensions.explain.resolverCalls.data
      })
    })
    view.rerender()

    act(() => {
      view.result.current.searchByPath({ target: { value: '0' } })
    })

    expect(view.result.current.resolverCalls).toEqual(
      resolverCallMapper(data.extensions.explain.resolverCalls.data).filter(e =>
        e.path.includes('0.status')
      )
    )
  })

  it('useResolverCalls should return and empty array if the paths does not contain the search query', () => {
    const view = renderHook(useResolverCalls)

    act(() => {
      explainDataManager.setExplain({
        resolverCalls: data.extensions.explain.resolverCalls.data
      })
    })
    view.rerender()

    act(() => {
      view.result.current.searchByPath({ target: { value: '------' } })
    })
    view.rerender()

    expect(view.result.current.resolverCalls).toHaveLength(0)
  })

  it('useResolverCalls should return the initial array if the search query is empty', () => {
    const view = renderHook(useResolverCalls)

    act(() => {
      explainDataManager.setExplain({
        resolverCalls: data.extensions.explain.resolverCalls.data
      })
    })
    view.rerender()

    act(() => {
      view.result.current.searchByPath({ target: { value: '' } })
    })
    view.rerender()

    expect(view.result.current.resolverCalls).toHaveLength(3)
  })
})
