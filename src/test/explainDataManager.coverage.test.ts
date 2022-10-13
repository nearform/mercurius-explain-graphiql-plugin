import { explainDataManager } from '../graphiql-explain/ExplainDataManager'
import { data } from './mockData'

const mockDispatchEvent = jest.spyOn(explainDataManager, 'dispatchEvent')

describe('Explain Data Manager', () => {
  it('Explain Data Manager should be called', () => {
    explainDataManager.setExplain(data.extensions.explain.profiler.data)
    expect(mockDispatchEvent).toBeCalledTimes(1)
  })

  it('Explain Data Manager saved data should persist', () => {
    explainDataManager.setExplain(data.extensions.explain.profiler.data)
    const explainData = explainDataManager.getExplainData()
    expect(data.extensions.explain.profiler.data).toEqual(explainData)
  })

  it('Explain Data Manager should have a default value and empty array', () => {
    explainDataManager.setExplain(undefined)
    const explainData = explainDataManager.getExplainData()
    expect(explainData).toHaveLength(0)
  })
})
