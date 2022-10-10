import React from 'react'
import { GraphiQL } from 'graphiql'
import { useExplainPlugin } from './graphiql-explain'
import { fetcherWrapper, parseExplainResponse } from './graphiql-explain/utils'
import 'graphiql/graphiql.css'
import '@graphiql/react/dist/style.css'
import { createGraphiQLFetcher } from '@graphiql/toolkit'

function App() {
  const explainPlugin = useExplainPlugin()
  const fetcher = createGraphiQLFetcher({
    url: 'http://localhost:3001/graphql'
  })

  const fetch = fetcherWrapper(fetcher, [parseExplainResponse])
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
