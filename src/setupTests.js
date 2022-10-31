require('@testing-library/jest-dom/extend-expect')

//adds the missing but required functions to document object so graphiql can be rendered
global.document.createRange = function () {
  return {
    setEnd() {},
    setStart() {},
    getClientRects() {
      return { top: 0, bottom: 0, left: 0, right: 0 }
    },
    getBoundingClientRect() {
      return { right: 0 }
    }
  }
}
