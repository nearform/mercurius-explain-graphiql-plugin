import { Content, Icon } from './pages/Explain'

export function graphiqlExplainPlugin() {
  return umdPlugin()
}

export function umdPlugin() {
  return {
    title: 'GraphiQL Explain',
    icon: () => <Icon />,
    content: () => {
      return <Content />
    }
  }
}
