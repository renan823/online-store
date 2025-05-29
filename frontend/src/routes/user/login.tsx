import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { LoginForm } from '@/components/features/user/login'
import z from 'zod';

export const Route = createFileRoute('/user/login')({
	validateSearch: z.object({
		redirect: z.string().optional().catch(''),
	}),
	component: RouteComponent,
})

function RouteComponent() {
	const navigate = useNavigate();
	const search = Route.useSearch();

	function handleRedirect() {
		navigate({ to: search.redirect || "/user/profile" });
	}

	return (
		<div className="grid min-h-[90vh] lg:grid-cols-2">
			<LoginForm redirect={handleRedirect} />
			<div className="relative hidden bg-muted lg:block">
				<img
					src="/assets/notebook.png"
					alt="Image"
					className="absolute inset-0 h-full w-full object-cover"
				/>
			</div>
		</div>
	)
}

