import { Button } from "@/components/ui/button"
import ControlledFieldError, { ControlledEmailInput, ControlledPasswordInput } from "@/components/ui/controlled-form"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useRouter, useSearch } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import z from "zod"

const LoginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

type LoginFormValues = z.infer<typeof LoginSchema>

interface LoginFormProps {
    redirect: () => void;
}

export function LoginForm({ redirect }: LoginFormProps) {
    const searchParams = useSearch({from: "/user/login"})
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(LoginSchema),
    })

    const { login } = useAuth();
    const router = useRouter();

    async function onSubmit(data: LoginFormValues) {
        login(data, redirect);

        await router.invalidate();
    }

    return (
        <div className="flex flex-col gap-4 p-6 md:p-10">
            <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-xs">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        <div className="flex flex-col items-center gap-2 text-center">
                            <h1 className="text-2xl font-bold">Faça login para continuar</h1>
                            <p className="text-balance text-sm text-muted-foreground">
                                Insira seu email para logar na conta
                            </p>
                        </div>

                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label>Email</Label>
                                <ControlledEmailInput
                                    name="email"
                                    control={control}
                                    placeholder="abc@exemplo.com"
                                    value=""
                                />
                                <ControlledFieldError error={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label>Senha</Label>
                                <ControlledPasswordInput
                                    name="password"
                                    control={control}
                                    placeholder="***********"
                                    value=""
                                />
                                <ControlledFieldError error={errors.password} />
                            </div>


                            <div className="flex flex-col items-center justify-center">
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? 'Entrando...' : 'Login'}
                                </Button>
                                <span className="m-3 text-sm">
                                    Não possui uma conta?
                                    <Link className="font-bold text-primary hover:text-rose-400" to="/user/register" search={{redirect: searchParams.redirect}}> Cadastre-se</Link>
                                </span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
