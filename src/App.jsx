import React from 'react'
import { GraphiQL } from 'graphiql'
import 'graphiql/graphiql.css'
import { useExplorerPlugin } from './grapfiql-explain/Explain'

const fetcher = async gqlp => {
  const data = await fetch('http://localhost:3001/graphql', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(gqlp),
    credentials: 'same-origin'
  })
  return data.json().catch(() => data.text())
}

function App() {
  return (
    <div style={{ height: '100vh' }}>
      <GraphiQL fetcher={fetcher} plugins={[useExplorerPlugin()]} />
    </div>
  )
}

export default App
