import { explainDataManager } from './ExplainDataManager'

export function saveExplainResponse(data) {
  const { explain } = data.extensions || {}

  if (explain && explain.profiler.data) {
    explainDataManager.setExplain(explain.profiler.data)
  }
  return data
}

export function parseExplainResponse(data) {
  return saveExplainResponse(data)
}
