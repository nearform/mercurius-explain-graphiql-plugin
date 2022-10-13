import { Content, Icon } from './Explain'

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
