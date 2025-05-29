import { useAuth } from '@/context/auth'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/user/profile')({
	beforeLoad: ({ context, location }) => {
		if (context.auth.user === null) {
			throw redirect({
				to: '/user/login',
				search: {
					redirect: location.href,
				},
			})
		}
	},
	component: RouteComponent,
})


function RouteComponent() {
	const { user } = useAuth();

	if (!user) {
		return (
			<div>Faça login</div>
		)
	}

	return (
		<div>
			<h1>Hello, {user.name}</h1>
		</div>
	)
}
