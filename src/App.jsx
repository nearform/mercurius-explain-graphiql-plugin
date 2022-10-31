import React from 'react'
import { GraphiQL } from 'graphiql'
import { createGraphiQLFetcher } from '@graphiql/toolkit'

import { graphiqlExplainPlugin, parseFetchResponse } from './graphiql-explain'
import { fetcherWrapper } from './fetcherWrapper'

import 'graphiql/graphiql.css'
import '@graphiql/react/dist/style.css'

function App() {
  const fetcher = createGraphiQLFetcher({
    url: 'http://localhost:3001/graphql'
  })

  const fetch = fetcherWrapper(fetcher, [parseFetchResponse])
  return (
    <div
      style={{
        height: '100vh',
        minWidth: '1080px',
        width: '100vw',
        overflow: 'scroll'
      }}
    >
      <GraphiQL fetcher={fetch} plugins={[graphiqlExplainPlugin()]} />
    </div>
  )
}

export default App
