class ExplainDataManager extends EventTarget {
  constructor() {
    super()
    this.explainData = {}
    this.currentTab = 'profiler'
  }
  getExplainData() {
    return this.explainData
  }

  getProfilerData() {
    return this.explainData.profiler || []
  }

  getResolverCallsData() {
    return this.explainData.resolverCalls || []
  }

  setExplain(explainData) {
    this.explainData = explainData || {}
    this.dispatchEvent(new Event('updateExplainData'))
  }

  getCurrentTab() {
    return this.currentTab
  }

  setCurrentTab(tab) {
    this.currentTab = tab
  }
}

export const explainDataManager = new ExplainDataManager()
export default explainDataManager
