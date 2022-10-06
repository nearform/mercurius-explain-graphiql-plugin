import React from 'react'
import { GraphiQL } from 'graphiql'
import 'graphiql/graphiql.css'
import { useExplainPlugin } from './graphiql-explain'
import { fetcher } from './utils'

function App() {
  return (
    <div style={{ height: '100vh' }}>
      <p data-testid="custom-element">This is rendered</p>
      <GraphiQL fetcher={fetcher} plugins={[useExplainPlugin()]} />
    </div>
  )
}

export default App
