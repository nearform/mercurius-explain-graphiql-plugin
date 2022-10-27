import { Profiler } from '../components/Profiler'
import { ResolverCalls } from '../components/ResolverCalls'

export const tabs = {
  profiler: {
    label: 'Profiler',
    renderComponent: props => <Profiler {...props} />
  },
  resolverCalls: {
    label: 'Resolver Calls',
    renderComponent: props => <ResolverCalls {...props} />
  }
}
