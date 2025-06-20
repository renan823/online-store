import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { RegisterUserSchema } from "../domain/profile";
import { CreateUserDTO } from "../domain/user";
import { createUserUseCase } from "../usecases/user/create";
import z from "zod";
import { checkCredentials } from "../usecases/auth/login";
import { sign } from "hono/jwt";
import { setCookie } from "hono/cookie";

const authRouter = new Hono().basePath('/auth');

// Register new user
authRouter.post('/register', zValidator("json", RegisterUserSchema),  async (c) => {
    const data = c.req.valid("json");
    const newUser: CreateUserDTO = {isAdmin: false, ...data}

    const created = await createUserUseCase(newUser);
    return c.json(created, 201);
});


const Credentials = z.object({
	email: z.string(),
	password: z.string()
})
authRouter.post("/login", zValidator("json", Credentials),  async (c) => {
	const { email, password } = await c.req.json()
	const matchedUserId = await checkCredentials(email, password)
	if(matchedUserId === null) return c.json({ error: 'Invalid credentials' }, 401);
	
	const payload = {
		id: matchedUserId,
		exp: Math.floor(Date.now() / 1000) + 60 * 60
	}
	const token = await sign(payload, "SECRET")
	setCookie(c, "id", matchedUserId)
	setCookie(c, "token", token)
	return c.json({
		payload,
		token
	})
})

export default authRouter