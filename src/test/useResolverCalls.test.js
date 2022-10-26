import { useResolverCalls } from '../graphiql-explain/hooks/useResolverCalls'
import { act, renderHook } from '@testing-library/react'
import { explainDataManager } from '../graphiql-explain/ExplainDataManager'
import { data } from './mocks'

describe('useResolverCalls hook', () => {
  beforeAll(() => {
    jest.resetAllMocks()
  })

  it('useResolverCalls hook init', () => {
    const view = renderHook(useResolverCalls)

    expect(view.result.current.resolverCalls).toHaveLength(0)
    expect(view.result.current.keyOrder).toEqual(0)
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
      { count: 1, key: 'Query.users' },
      { count: 2, key: 'User.addresses' },
      { count: 2, key: 'User.status' }
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

    expect(view.result.current.keyOrder).toEqual(0)
    expect(view.result.current.countOrder).toEqual(1)
    expect(view.result.current.resolverCalls).toEqual([
      { count: 1, key: 'Query.users' },
      { count: 2, key: 'User.addresses' },
      { count: 2, key: 'User.status' }
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
    expect(view.result.current.keyOrder).toEqual(0)
    expect(view.result.current.resolverCalls).toEqual([
      { count: 2, key: 'User.addresses' },
      { count: 2, key: 'User.status' },
      { count: 1, key: 'Query.users' }
    ])
  })

  it("useResolverCalls should change the keyOrder to 1 if it's not set", () => {
    const view = renderHook(useResolverCalls)

    act(() => {
      view.result.current.changeKeyOrder()
    })
    view.rerender()

    expect(view.result.current.countOrder).toEqual(0)
    expect(view.result.current.keyOrder).toEqual(1)
  })

  it("useResolverCalls should change the keyOrder to -1 if it's already set", () => {
    const view = renderHook(useResolverCalls)

    act(() => {
      view.result.current.changeKeyOrder()
    })
    view.rerender()

    act(() => {
      view.result.current.changeKeyOrder()
    })
    view.rerender()

    expect(view.result.current.countOrder).toEqual(0)
    expect(view.result.current.keyOrder).toEqual(-1)
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
      view.result.current.searchByKey({ target: { value: '0' } })
    })

    expect(view.result.current.resolverCalls).toEqual(
      data.extensions.explain.resolverCalls.data.filter(e =>
        e.key.includes('0.status')
      )
    )
  })

  it('useResolverCalls should return and empty array if the keys does not contain the search query', () => {
    const view = renderHook(useResolverCalls)

    act(() => {
      explainDataManager.setExplain({
        resolverCalls: data.extensions.explain.resolverCalls.data
      })
    })
    view.rerender()

    act(() => {
      view.result.current.searchByKey({ target: { value: '------' } })
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
      view.result.current.searchByKey({ target: { value: '' } })
    })
    view.rerender()

    expect(view.result.current.resolverCalls).toHaveLength(3)
  })
})
