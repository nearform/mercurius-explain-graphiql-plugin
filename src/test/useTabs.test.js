import { useTabs } from '../graphiql-explain/hooks/useTabs'
import explainDataManager from '../graphiql-explain/ExplainDataManager'
import { act, renderHook } from '@testing-library/react'

describe('useTabs', () => {
  it('should initialize with profiler tab', () => {
    const view = renderHook(useTabs)

    expect(view.result.current.currentTab).toBe('profiler')
  })

  it('should change to tabs and save to explain data manager', () => {
    const view = renderHook(useTabs)
    const nextTab = 'resolverCalls'

    act(() => {
      view.result.current.setCurrentTab(nextTab)
    })

    expect(explainDataManager.currentTab).toBe(nextTab)
    expect(view.result.current.currentTab).toBe(nextTab)
  })
})
