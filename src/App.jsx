import React from 'react'
import { GraphiQL } from 'graphiql'
import 'graphiql/graphiql.css'
import { useExplainPlugin } from './graphiql-explain'
import { fetcher } from './utils'
import '@graphiql/react/dist/style.css'
function App() {
  return (
    <div style={{ height: '100vh', width: '1080px', overflow: 'scroll' }}>
      <GraphiQL fetcher={fetcher} plugins={[useExplainPlugin()]} />
    </div>
  )
}

export default App
