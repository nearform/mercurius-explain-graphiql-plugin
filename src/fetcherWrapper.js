import { fetcherReturnToPromise } from '@graphiql/toolkit'

export const fetcherWrapper = (fetcher, cbs = []) => {
  return async (gqlp, fetchOpt) => {
    const fetchResponse = await fetcher(gqlp, fetchOpt)
    const result = await fetcherReturnToPromise(fetchResponse)
    let cbsResult = { ...result }
    for (const cb of cbs) cbsResult = cb(cbsResult)
    return cbsResult
  }
}
