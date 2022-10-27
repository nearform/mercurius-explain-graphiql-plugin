# Mercurius Explain Graphiql Plugin

A [`GraphiQL`](https://github.com/graphql/graphiql) extension to show 
the output generated by the `mercurius-explain` [plugin](https://github.com/nearform/mercurius-explain), 
a plugin that exports execution info related to a graphql query:
* profiling of resolvers execution time
* number of calls per resolver

![alt text](docs/profiler.png 'Profiler View')

![alt text](docs/resolverCalls.png 'Resolver Calls View')

Check the `mercurius-explain` [Github Repo](https://github.com/nearform/mercurius-explain) for detailed information.

### Profiler Details

**Calculations**

Data from the Mercurius Explain goes through some calculations to display accurately the behaviour of a query or mutation.
Time, as an exemple, is defined by the temporal cost of the resolver operation of a specific type or property, from start to end.
This can be misleading as one property may have to call other resolvers to retrieve the needed data. Therefore, we append totals that take in consideration the end of the furthest child node that composes its resolution.
This is visible in the [first image of this README](#mercurius-explain-graphiql-plugin) with the root path, Users. It takes a minimum amount of time to resolve Users but the total time is always going to be the highest, because all the other types and properties should be resolved for us to consider it complete.

**Thresholds**

The results of the profiler are coloured to demonstrate the relative duration of each property of a path
in relation to the maximum value of the corresponding property, i.e. Time, Total Time.
We are going to support custom intervals settings, however, at the moment we are displaying the data according to the percentage groups:

- 0% to 49% - White (default)
- 50% to 69% - Light Yellow
- 70% to 89% - Yellow
- 90% - 98% - Orange
- +99% - Red

## Quick start

This plugin is deployed as UMD to unpkg.com and is available 
without a direct install in the `GraphiQL` `mercurius` integration. 

```javascript
import Fastify from 'fastify'
import mercurius from 'mercurius'
import explain, { explainGraphiQLPlugin } from 'mercurius-explain'

const app = Fastify({ logger: true })

const schema = `type Query { add(x: Int, y: Int): Int }`

const resolvers = {
  Query: {
    async add(_, { x, y }) { return x + y }
  }
}

app.register(mercurius, {
  schema,
  resolvers,
  graphiql: {
    enabled: true,                      // Enable GraphiQL
    plugins: [explainGraphiQLPlugin()]  // Add Mercurius Explain Graphiql Plugin
  }
})

app.register(explain, {})
app.listen({ port: 3000 })
```

## Install in a custom GraphiQL App

The plugin can be installed also in a custom GraphiQL app.

### CLone and run a sample Graphql server

```bash
git clone https://github.com/nearform/mercurius-explain.git
cd mercurius-explain
npm install
npm run example
```

A sample server runs on `http://localhost:3001`.

Test it with: 

```bash
curl http://localhost:3001

> {"status":"OK"}
```

### Create the basic GraphiQL app

Create the app using Create React App and install the required modules.

```bash
npx create-react-app custom-graphiql
cd custom-graphiql
npm i graphql graphql-ws
npm i graphiql @graphiql/toolkit @graphiql/react
```

Replace the `App.jsx` with the following content:

```javascript
import React from 'react'
import { GraphiQL } from 'graphiql'
import { createGraphiQLFetcher } from '@graphiql/toolkit'

import 'graphiql/graphiql.css'
import '@graphiql/react/dist/style.css'

function App() {
  const fetcher = createGraphiQLFetcher({
    url: 'http://localhost:3001/graphql'  
  })

  return (
    <div
      style={{
        height: '100vh',
        minWidth: '1080px',
        width: '100vw',
        overflow: 'scroll'
      }}
    >
      <GraphiQL fetcher={fetcher} />
    </div>
  )
}

export default App
```

Run the app
```bash
npm start
```

and test it with the query: 

```javascript
{
  users {
    name
    status { enabled }
    addresses { zip }
  }
}
```

### Add the plugin

```bash
npm i mercurius-explain-graphiql-plugin
```

add the plugin to the code:

Import the plugin
```javascript
...
import { fetcherReturnToPromise } from '@graphiql/toolkit'
import { graphiqlExplainPlugin, parseExplainResponse } from 'mercurius-explain-graphiql-plugin'
...

```

Add a fetchWrapper function

```javascript
const fetcherWrapper = (fetcher, cbs = []) => {
  return async (gqlp, fetchOpt) => {
    const fetchResponse = await fetcher(gqlp, fetchOpt)
    const result = await fetcherReturnToPromise(fetchResponse)
    let cbsResult = { ...result }
    for (const cb of cbs) cbsResult = cb(cbsResult)
    return cbsResult
  }
}
```

and wrap the fetcher before add it to the GraphiQL component

```javascript
const fetcher = fetcherWrapper(createGraphiQLFetcher({
  url: 'http://localhost:3001/graphql'
}), [parseExplainResponse])
```

> NOTE: This operation is required because GraphiQL does not provide an easy access to the result of the query, 
then the result is got directly from the fetch action.

add the plugin to the GraphiQL component

```javascript
...
  <GraphiQL fetcher={fetch} plugins={[graphiqlExplainPlugin()]} />
...
```

The final version of App.jsx

```javascript
import React from 'react'
import { GraphiQL } from 'graphiql'
import { createGraphiQLFetcher, fetcherReturnToPromise } from '@graphiql/toolkit'

import 'graphiql/graphiql.css'
import '@graphiql/react/dist/style.css'

import { graphiqlExplainPlugin, parseExplainResponse } from 'mercurius-explain-graphiql-plugin'

export const fetcherWrapper = (fetcher, cbs = []) => {
  return async (gqlp, fetchOpt) => {
    const fetchResponse = await fetcher(gqlp, fetchOpt)
    const result = await fetcherReturnToPromise(fetchResponse)
    let cbsResult = { ...result }
    for (const cb of cbs) cbsResult = cb(cbsResult)
    return cbsResult
  }
}

function App() {
  const fetcher = fetcherWrapper(createGraphiQLFetcher({
    url: 'http://localhost:3001/graphql'
  }), [parseExplainResponse])

  return (
    <div
      style={{
        height: '100vh',
        minWidth: '1080px',
        width: '100vw',
        overflow: 'scroll'
      }}
    >
      <GraphiQL fetcher={fetcher} plugins={[graphiqlExplainPlugin()]}/>
    </div>
  )
}

export default App
```


## API

### graphiqlExplainPlugin

The plugin component should be added to the GraphiQL component in the `plugins` list

```
<GraphiQL fetcher={fetcher} plugins={[graphiqlExplainPlugin()]}/>
```

### parseExplainResponse

A function that extract the `explain` data from the query response.
It should be passed to the `fetcherWrapper`.

```javascript
export const fetcherWrapper = (fetcher, cbs = []) => {
  return async (gqlp, fetchOpt) => {
    const fetchResponse = await fetcher(gqlp, fetchOpt)
    const result = await fetcherReturnToPromise(fetchResponse)
    let cbsResult = { ...result }
    for (const cb of cbs) cbsResult = cb(cbsResult)
    return cbsResult
  }
}

const fetcher = fetcherWrapper(createGraphiQLFetcher({
  url: 'http://localhost:3001/graphql'
}), [parseExplainResponse])
```
