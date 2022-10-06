export const fetcher = async gqlp => {
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
