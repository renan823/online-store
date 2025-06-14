import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { RegisterForm } from '@/components/features/user/register'
import z from 'zod';

export const Route = createFileRoute('/user/register')({
	validateSearch: z.object({
		redirect: z.string().optional().catch(''),
	}),
	component: RouteComponent,
})

function RouteComponent() {
	const navigate = useNavigate();
	const search = Route.useSearch();

	function handleRedirect() {
		navigate({ to: search.redirect || "/" });
	}

	return (
		<div className="grid min-h-[90vh] lg:grid-cols-2">
			<div className="relative hidden lg:block">
				<img
					src="/assets/notebook-light.jpg"
					alt="Image"
					className="rounded-xl absolute inset-0 h-full w-full object-cover"
				/>
			</div>
			<RegisterForm redirect={handleRedirect} />
		</div>
	)
}

