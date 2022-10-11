import { explainDataManager } from './ExplainDataManager'
import { fetcherReturnToPromise } from '@graphiql/toolkit'
/**
 *
 * @param {Fetcher} fetcher
 * @param {((response:any)=>result)[]} cbs
 * @returns
 * @description
 * This function will be a wrapper over `createGrapiqlFetcher` allowing use the result before it's displayed.
 *
 */

export const fetcherWrapper = (fetcher, cbs = []) => {
  return async (gqlp, fetchOpt) => {
    const fetchResponse = await fetcher(gqlp, fetchOpt)
    const result = await fetcherReturnToPromise(fetchResponse)
    let cbsResult = { ...result }
    for (const cb of cbs) cbsResult = cb(cbsResult)
    return cbsResult
  }
}

export function saveExplainResponse(data) {
  const { explain } = data.extensions || {}
  if (explain) {
    explainDataManager.setExplain(explain)
  }
  return data
}

export function deleteExplainFromResponse(data) {
  if (data.extensions.explain) {
    delete data.extensions.explain
  }
  return data
}

export function parseExplainResponse(data) {
  return deleteExplainFromResponse(saveExplainResponse(data))
}
