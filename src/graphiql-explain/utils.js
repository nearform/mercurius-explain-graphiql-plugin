import { explainDataManager } from './ExplainDataManager'

/**
 *
 * @param {CreateFetcherOptions} options
 * @param {((response:any)=>result)[]} cbs
 * @returns
 * @description
 * This function will be a wrapper over `createGrapiqlFetcher` allowing use the result before it's displayed.
 *
 */
export const fetcherWrapper = (fetcher, cbs = []) => {
  return async (gqlp, fetchOpt) => {
    const fetchResponse = await fetcher(gqlp, fetchOpt)
    if (fetchResponse.next) {
      const result = await fetchResponse.next()
      let cbsResult = { ...result.value }
      for (const cb of cbs) cbsResult = cb(cbsResult)
      return cbsResult
    }
    return fetchResponse
  }
}

export function saveExplainResponse(data) {
  const { explain } = data.data
  if (explain) {
    explainDataManager.setExplain(explain)
  }
  return data
}

export function deleteExplainFromResponse(data) {
  const newResponse = { ...data }
  delete newResponse.data.__explain
  return newResponse
}

export function parseExplainResponse(data) {
  return deleteExplainFromResponse(saveExplainResponse(data))
}
