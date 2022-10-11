import { useExplain } from '../graphiql-explain/useExplain'
import { act, renderHook } from '@testing-library/react'
import { explainDataManager } from '../graphiql-explain/ExplainDataManager'
import { data } from './mockData'
describe('useExplain hook', () => {
  it('useExplain hook init', () => {
    const view = renderHook(useExplain)
    expect(view.result.current.explain).toHaveLength(0)
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
})
