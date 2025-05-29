import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/users')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div>
			<h1>Users</h1>
		</div>
	)
}
