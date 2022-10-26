import {
  saveExplainResponse,
  parseExplainResponse,
  appendTotalsToExplainResponse
} from '../graphiql-explain/utils'
import { explainDataManager } from '../graphiql-explain/ExplainDataManager'
import { data, simplifiedData } from './mocks'

let mockData

const mockSetExplain = jest.spyOn(explainDataManager, 'setExplain')
beforeEach(() => {
  jest.resetAllMocks()
  mockData = JSON.parse(JSON.stringify(data))
})

describe('Check the utils functions', () => {
  it('saveExplainResponse should return the save body', async () => {
    const response = saveExplainResponse(mockData)

    expect(response).toEqual(mockData)
    expect(mockSetExplain).toBeCalledTimes(1)
    expect(mockSetExplain).toBeCalledWith({
      profiler: mockData.extensions.explain.profiler.data,
      resolverCalls: mockData.extensions.explain.resolverCalls.data
    })
  })

  it('parseExplainResponse shoud call setExplain and delete explain', () => {
    const mockExplain = {
      profiler: [...mockData.extensions.explain.profiler.data],
      resolverCalls: { ...mockData.extensions.explain.resolverCalls.data }
    }

    expect(mockData.extensions.explain.profiler.data.length).toBeGreaterThan(0)
    expect(mockData.extensions.explain.resolverCalls.data).not.toStrictEqual({})

    const response = parseExplainResponse(mockData)

    expect(response).toEqual(mockData)
    expect(mockSetExplain).toBeCalledTimes(1)
    expect(mockSetExplain).toBeCalledWith(mockExplain)
  })

  it('appendTotalsToExplainResponse should add totals for each path of explain', () => {
    const mockSimplifiedData = JSON.parse(JSON.stringify(simplifiedData))
    const mockExplain = [...mockSimplifiedData.extensions.explain.profiler.data]
    const response = appendTotalsToExplainResponse(mockExplain)

    expect(response).toEqual([
      {
        path: 'users',
        begin: 1,
        end: 2,
        time: 1,
        totalBegin: 1,
        totalEnd: 5,
        totalTime: 4
      },
      {
        path: 'users.0.addresses',
        begin: 3,
        end: 4,
        time: 1,
        totalBegin: 3,
        totalEnd: 4,
        totalTime: 1
      },
      {
        path: 'users.1.addresses',
        begin: 2,
        end: 4,
        time: 2,
        totalBegin: 2,
        totalEnd: 4,
        totalTime: 2
      },
      {
        path: 'users.0.status',
        begin: 2,
        end: 3,
        time: 1,
        totalBegin: 2,
        totalEnd: 3,
        totalTime: 1
      },
      {
        path: 'users.1.status',
        begin: 2,
        end: 5,
        time: 3,
        totalBegin: 2,
        totalEnd: 5,
        totalTime: 3
      }
    ])
  })
})
