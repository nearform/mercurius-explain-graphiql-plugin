// @ts-ignore
import mockToolkit from '@graphiql/toolkit'

import {
  saveExplainResponse,
  parseExplainResponse,
  appendTotalsToExplainResponse
} from '../graphiql-explain/utils'
import { explainDataManager } from '../graphiql-explain/ExplainDataManager'
import { data, gqlp, simplifiedData } from './mockData'
import { fetcherWrapper } from '../fetcherWrapper'

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
    expect(mockSetExplain).toBeCalledWith(
      mockData.extensions.explain.profiler.data
    )
  })

  it('parseExplainResponse shoud call setExplain and delete explain', () => {
    const mockExplain = [...mockData.extensions.explain.profiler.data]
    expect(mockData.extensions.explain.profiler.data.length).toBeGreaterThan(0)
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

jest.mock('@graphiql/toolkit', () => {
  return {
    createGraphiQLFetcher: opts => (gqlp, fetchOptions) => {
      return Promise.resolve({})
    },
    fetcherReturnToPromise: opts =>
      Promise.resolve({
        data: {
          users: [
            {
              name: 'Davide',
              addresses: [
                {
                  zip: '12345'
                },
                {
                  zip: '54321'
                }
              ],
              status: {
                enabled: true
              }
            },
            {
              name: 'Mario',
              addresses: [
                {
                  zip: '12345'
                },
                {
                  zip: '54321'
                }
              ],
              status: {
                enabled: true
              }
            }
          ]
        },
        extensions: {
          explain: {
            profiler: {
              data: [
                {
                  path: 'users',
                  begin: 2180524057777125,
                  end: 2180524359067041,
                  time: 301289916
                },
                {
                  path: 'users.0.addresses',
                  begin: 2180524359216958,
                  end: 2180524480481083,
                  time: 121264125
                },
                {
                  path: 'users.1.addresses',
                  begin: 2180524359351708,
                  end: 2180524480591458,
                  time: 121239750
                },
                {
                  path: 'users.0.status',
                  begin: 2180524359295541,
                  end: 2180524560765875,
                  time: 201470334
                },
                {
                  path: 'users.1.status',
                  begin: 2180524359356041,
                  end: 2180524560907916,
                  time: 201551875
                }
              ]
            }
          }
        }
      })
  }
})

describe('Testing the fetcherWrapper', () => {
  beforeEach(() => {
    mockData = JSON.parse(JSON.stringify(data))
  })

  it('Fetcher called with no callback should return th response body', async () => {
    const fetcher = mockToolkit.createGraphiQLFetcher({
      url: 'http://localhost:3001/graphql'
    })
    const wrapFetcher = fetcherWrapper(fetcher)
    const response = await wrapFetcher(gqlp, {})
    expect(response).toEqual(mockData)
  })
})
