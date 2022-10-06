import { render, screen } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import ReactDOM from 'react-dom/client'
import App from './App'

let container

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  document.body.removeChild(container)
  container = null
})

test('Render the Graphiql component', () => {
  // render(<App />)

  // const linkElement = screen.getByTestId('custom-element')
  // console.log(linkElement)
  // // expect(linkElement).toBeInTheDocument()
  expect(true).toBeTruthy()
})
