class ExplainDataManager extends EventTarget {
  explainData = []

  getExplainData() {
    return this.explainData
  }

  setExplain(explainData) {
    this.explainData = explainData
    this.dispatchEvent(new Event('updateExplainData'))
  }
}

export const explainDataManager = new ExplainDataManager()
export default explainDataManager
