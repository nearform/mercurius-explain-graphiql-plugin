import React from 'react'
import { GraphiQL } from 'graphiql'
import 'graphiql/graphiql.css'
import { useExplainPlugin } from './grapfiql-explain'
import { fetcher } from './utils'

function App() {
  return (
    <div style={{ height: '100vh' }}>
      <GraphiQL fetcher={fetcher} plugins={[useExplainPlugin()]} />
    </div>
  )
}

export default App
