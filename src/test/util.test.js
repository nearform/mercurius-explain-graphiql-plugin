import {
  saveExplainResponse,
  parseFetchResponse,
  appendTotalsToExplainResponse,
  getColorByLimit
} from '../graphiql-explain/utils'
import { explainDataManager } from '../graphiql-explain/ExplainDataManager'
import { data, simplifiedData } from './mocks'
import { colors } from '../graphiql-explain/constants/thresholds'

let mockData
let mockSimplifiedData

const mockSetExplain = jest.spyOn(explainDataManager, 'setExplain')
beforeEach(() => {
  jest.resetAllMocks()
  mockData = JSON.parse(JSON.stringify(data))
  mockSimplifiedData = JSON.parse(JSON.stringify(simplifiedData))
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

  it('parseFetchResponse shoud call setExplain and delete explain', () => {
    const mockExplain = {
      profiler: [...mockData.extensions.explain.profiler.data],
      resolverCalls: [...mockData.extensions.explain.resolverCalls.data]
    }

    expect(mockData.extensions.explain.profiler.data.length).toBeGreaterThan(0)
    expect(
      mockData.extensions.explain.resolverCalls.data.length
    ).toBeGreaterThan(0)

    const response = parseFetchResponse(mockData)

    expect(response).toEqual(mockData)
    expect(mockSetExplain).toBeCalledTimes(1)
    expect(mockSetExplain).toBeCalledWith(mockExplain)
  })

  it('appendTotalsToExplainResponse should add totals for each path of explain', () => {
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

  it('getColorByLimit should return proper color based on threshold', () => {
    const mockExplain = [...mockSimplifiedData.extensions.explain.profiler.data]
    const response = appendTotalsToExplainResponse(mockExplain)

    const timeMax = Math.max(...response.map(datum => datum.time))
    const totalTimeMax = Math.max(...response.map(datum => datum.totalTime))

    const simplifiedDataColored = response.map(({ path, time, totalTime }) => {
      const timeRatio = time / timeMax
      const totalTimeRatio = totalTime / totalTimeMax
      return {
        path,
        time: {
          threshold: timeRatio,
          color: getColorByLimit(timeRatio)
        },
        totalTime: {
          threshold: totalTimeRatio,
          color: getColorByLimit(totalTimeRatio)
        }
      }
    })

    expect(simplifiedDataColored).toEqual([
      {
        path: 'users',
        totalTime: { color: colors.veryHigh, threshold: 1 },
        time: { color: colors.default, threshold: 0.3333333333333333 }
      },
      {
        path: 'users.0.addresses',
        totalTime: { color: colors.default, threshold: 0.25 },
        time: { color: colors.default, threshold: 0.3333333333333333 }
      },
      {
        path: 'users.1.addresses',
        totalTime: { color: colors.low, threshold: 0.5 },
        time: { color: colors.low, threshold: 0.6666666666666666 }
      },
      {
        path: 'users.0.status',
        totalTime: { color: colors.default, threshold: 0.25 },
        time: { color: colors.default, threshold: 0.3333333333333333 }
      },
      {
        path: 'users.1.status',
        totalTime: { color: colors.medium, threshold: 0.75 },
        time: { color: colors.veryHigh, threshold: 1 }
      }
    ])
  })
})
