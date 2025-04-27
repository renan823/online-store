import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/profile')({
	component: RouteComponent,
})

// Sensivel ao login! Deve verificar se esta logado etc
// Para teste, está por padrão logado
// Se não estiver logado, vai para login
function RouteComponent() {
	return <div>Hello "/user/profile"!</div>
}
