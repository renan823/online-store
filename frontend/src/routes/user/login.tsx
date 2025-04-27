import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/login')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="grid min-h-[90vh] lg:grid-cols-2">
			<LoginForm/>
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

function LoginForm() {
	return (
		<div className="flex flex-col gap-4 p-6 md:p-10">
			<div className="flex flex-1 items-center justify-center">
				<div className="w-full max-w-xs">
					<form className="flex flex-col gap-6">
						<div className="flex flex-col items-center gap-2 text-center">
							<h1 className="text-2xl font-bold">Faça login para continuar</h1>
							<p className="text-balance text-sm text-muted-foreground">
								Insira seu email para logar na conta
							</p>
						</div>
						<div className="grid gap-6">
							<div className="grid gap-2">
								<Label htmlFor="email">Email</Label>
								<Input id="email" type="email" placeholder="abc@examplo.com" required />
							</div>
							<div className="grid gap-2">
								<Label htmlFor="password">Senha</Label>
								<Input id="password" type="password" required />
							</div>
							<Button type="submit" className="w-full">
								Login
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
