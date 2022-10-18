import { explainDataManager } from './ExplainDataManager'

function plainToTree(data) {
  const tree = {
    path: '',
    children: {}
  }
  data.forEach(entry => {
    getObjectByPath(tree, entry)
  })

  return tree
}

function enrichWithTotals(tree) {
  if (!Object.keys(tree.children).length) {
    tree.totalBegin = tree.begin
    tree.totalEnd = tree.end
    tree.totalTime = tree.end - tree.begin
    return
  }

  let max = 0
  let min = tree.begin || Number.MAX_VALUE
  Object.entries(tree.children).forEach(([key, value]) => {
    enrichWithTotals(value)
    max = Math.max(max, value.totalEnd)
    min = Math.min(min, value.totalBegin)
  })

  tree.totalBegin = min
  tree.totalEnd = max
  tree.totalTime = max - min
}

function getObjectByPath(root, entry) {
  const path = entry.path.split('.')

  let currentRoot = root
  for (const index of path) {
    if (!currentRoot.children[index]) {
      currentRoot.children[index] = {
        children: {}
      }
    }
    currentRoot = currentRoot.children[index]
  }

  Object.assign(currentRoot, entry)
}

function getTreeNodeByPath(root, path) {
  const paths = path.split('.')
  let currentRoot = root
  let pathData = {}
  for (const index of paths) {
    pathData = currentRoot[index]
    currentRoot = currentRoot[index].children
  }

  return pathData
}

function treeToPlain(tree, data) {
  const dataTotals = data.map(({ path }) =>
    getTreeNodeByPath(tree.children, path)
  )

  return dataTotals.map(({ children, ...datumTotals }) => datumTotals)
}

export function appendTotalsToExplainResponse(originalData) {
  const tree = plainToTree(originalData)
  enrichWithTotals(tree)
  const dataTotals = treeToPlain(tree, originalData)
  return dataTotals
}

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
