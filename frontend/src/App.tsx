import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import router from './router'
import { PopupLoaderProvider } from './components/loader/PopupLoader'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {},
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PopupLoaderProvider>
        <RouterProvider router={router} />
      </PopupLoaderProvider>
    </QueryClientProvider>
  )
}

export default App
