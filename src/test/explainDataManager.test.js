import { explainDataManager } from '../graphiql-explain/ExplainDataManager'
import { data } from './mocks'

const mockDispatchEvent = jest.spyOn(explainDataManager, 'dispatchEvent')

describe('Explain Data Manager', () => {
  it('Explain Data Manager should be called', () => {
    explainDataManager.setExplain({
      profiler: data.extensions.explain.profiler.data,
      resolverCalls: data.extensions.explain.resolverCalls.data
    })

    expect(mockDispatchEvent).toBeCalledTimes(1)
  })

  it('Explain Data Manager saved data should persist', () => {
    explainDataManager.setExplain({
      profiler: data.extensions.explain.profiler.data,
      resolverCalls: data.extensions.explain.resolverCalls.data
    })

    const profilerData = explainDataManager.getProfilerData()
    const resolverCallData = explainDataManager.getResolverCallsData()

    expect(data.extensions.explain.profiler.data).toEqual(profilerData)
    expect(data.extensions.explain.resolverCalls.data).toEqual(resolverCallData)
  })

  it('Explain Data Manager should have a default value and empty array', () => {
    explainDataManager.setExplain(undefined)

    const profilerData = explainDataManager.getProfilerData()
    const resolverCallData = explainDataManager.getResolverCallsData()

    expect(profilerData).toHaveLength(0)
    expect(resolverCallData).toStrictEqual({})
  })
})
