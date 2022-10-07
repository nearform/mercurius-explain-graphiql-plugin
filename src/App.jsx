import React from 'react'
import { GraphiQL } from 'graphiql'
import { useExplainPlugin } from './graphiql-explain'
import { createFetcher, parseExplainResponse } from './graphiql-explain/utils'
import 'graphiql/graphiql.css'
import '@graphiql/react/dist/style.css'

function App() {
  const explainPlugin = useExplainPlugin()
  const fetch = createFetcher({ url: 'http://localhost:3001/graphql' }, [
    parseExplainResponse
  ])
  return (
    <div
      style={{
        height: '100vh',
        minWidth: '1080px',
        width: '100vw',
        overflow: 'scroll'
      }}
    >
      <GraphiQL fetcher={fetch} plugins={[explainPlugin]} />
    </div>
  )
}

export default App
