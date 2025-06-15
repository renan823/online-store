import { Button } from "@/components/ui/button"
import ControlledFieldError, { ControlledEmailInput, ControlledPasswordInput, ControlledTextInput } from "@/components/ui/controlled-form"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/auth"
import { RegisterUserDTO } from "@/lib/types/user"
import { useRegisterUser } from "@/services/user.service"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useRouter, useSearch } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import z from "zod"

const RegisterSchema = z.object({
    name: z.string(),
    phone: z.string(),
    address: z.string(),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    passwordConfirm: z.string()
}).superRefine( ({ passwordConfirm, password }, ctx) => {
    if (passwordConfirm !== password){
        ctx.addIssue({
            code: "custom",
            message: "As senhas não correspondem",
            path: ['passwordConfirm']
        })
    }
})

type RegisterFormValues = z.infer<typeof RegisterSchema>

interface RegisterFormProps {
    redirect: () => void;
}

export function RegisterForm({ redirect }: RegisterFormProps) {
    const searchParams = useSearch({from: "/user/register"})
    const createUser = useRegisterUser()
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(RegisterSchema),
    })

    const { login } = useAuth();
    const router = useRouter();

    async function onSubmit(data: RegisterFormValues) {
        const payload: RegisterUserDTO = {
            name: data.name,
            address: data.address,
            phone: data.phone,
            email: data.email,
            password: data.password
        }
        createUser.mutate(payload, {onSuccess: async () => {
            login(data);
            await router.invalidate();
            redirect();
        }})
    }

    return (
        <div className="flex flex-col gap-4 p-6 md:p-10">
            <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-xs">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        <div className="flex flex-col items-center gap-2 text-center">
                            <h1 className="text-2xl font-bold">Cadastre-se</h1>
                            <p className="text-balance text-sm text-muted-foreground">
                                Crie uma conta para aproveitar os nossos produtos!
                            </p>
                        </div>

                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label>Nome</Label>
                                <ControlledTextInput
                                    name="name"
                                    control={control}
                                    placeholder="Joãozinho"
                                    value=""
                                />
                                <ControlledFieldError error={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label>Telefone</Label>
                                <ControlledTextInput
                                    name="phone"
                                    control={control}
                                    placeholder="11 949735521"
                                    value=""
                                />
                                <ControlledFieldError error={errors.phone} />
                            </div>

                            <div className="grid gap-2">
                                <Label>Endereço</Label>
                                <ControlledTextInput
                                    name="address"
                                    control={control}
                                    placeholder="Rua Jacinto Favoretto, 123"
                                    value=""
                                />
                                <ControlledFieldError error={errors.address} />
                            </div>

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

                            <div className="grid gap-2">
                                <Label>Confirme a Senha</Label>
                                <ControlledPasswordInput
                                    name="passwordConfirm"
                                    control={control}
                                    placeholder="***********"
                                    value=""
                                />
                                <ControlledFieldError error={errors.passwordConfirm} />
                            </div>


                            <div className="flex flex-col items-center justify-center">
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? 'Criando...' : 'Cadastre-se'}
                                </Button>
                                <span className="m-3 text-sm">
                                    Já possui uma conta?
                                    <Link className="font-bold text-primary hover:text-rose-400" to="/user/login" search={{redirect: searchParams.redirect}}> Faça login</Link>
                                </span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
