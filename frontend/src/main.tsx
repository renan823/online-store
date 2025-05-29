import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import '@/global.css'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './context/auth'
import { CartProvider, useCart } from './context/cart'


// Create a new router instance
const router = createRouter({
	routeTree,
	defaultPreload: 'intent',
	scrollRestoration: true,
	context: {
		auth: undefined!,
		cart: undefined!
	},
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

const queryClient = new QueryClient()

function InnerApp() {
	const auth = useAuth();
	const cart = useCart();

	return (
		<RouterProvider router={router} context={{ auth, cart }} />
	)
}

function App() {
	return (
		<AuthProvider>
			<CartProvider>
				<InnerApp />
			</CartProvider>
		</AuthProvider>
	)
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement)
	root.render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>
		</StrictMode>,
	)
}