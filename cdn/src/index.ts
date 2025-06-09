import { serve } from 'bun'
import { Hono } from 'hono'

import { serveStatic } from 'hono/bun'
import * as path from 'path'
import { existsSync } from 'fs';
import { unlink } from 'fs/promises';

import { cors } from 'hono/cors';
import { logger } from 'hono/logger'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod';

const UPLOADS = "./uploads";

const app = new Hono();

app.use(logger());

// Ativando CORS globalmente
app.use(
	'*',
	cors({
		origin: '*',
		allowMethods: ['GET', 'POST', 'DELETE'],
		allowHeaders: ['Content-Type', 'Authorization'],
	})
);

/*
Retorna o arquivo desejado do folder de uploads.
*/
app.get('/:filename', serveStatic({ root: UPLOADS }));

/*
Recebe e salva arquivos enviados pelo usuario.
Retorna os respectivos ids gerados.
*/
app.post('/upload', async (c) => {
	const body = await c.req.parseBody();
	const input = body["file[]"];

	if (!input) {
		return c.json({ "message": "No files uploaded" }, 400);
	}

	const files = Array.isArray(input) ? input : [input];
	const results: string[] = [];

	for (const file of files) {
		if (typeof file === 'string') {
			continue;
		}

		// Gera ids e salva os arquivos localmente
		const filename = `${crypto.randomUUID()}.${extension(file.name)}`;
		const filepath = path.join(UPLOADS, filename);

		await Bun.write(filepath, Buffer.from(await file.arrayBuffer()));

		results.push(filename);
	}

	return c.json(results, 200);
})

/*
Deleta os arquivos informados (se existirem) do folder.
*/
const DeleteFilesSchema = z.object({ files: z.array(z.string()) });

app.delete('/', zValidator("json", DeleteFilesSchema), async (c) => {
	const { files } = c.req.valid("json");
	const errors: Record<string, string> = {};

	try {

		for (const file of files) {
			// Ignora imagems placeholder - "placehold.co"
			if (file.includes("placehold.co")) {
				continue;
			}

			// Previne path traversal (como usar .. para subir diretórios)
			if (file.includes('..')) {
				errors[file] = "Invalid file path";
				continue;
			}

			console.log(file)

			const filePath = path.join(UPLOADS, file);

			if (!existsSync(filePath)) {
				errors[file] = "File not found";
				continue;
			}

			await unlink(filePath);
		}

		// Trata errors que podem acontecer em cada remoção
		if (Object.keys(errors).length !== 0) {
			return c.json(errors, 400);
		}

		return c.json(true, 200);
	} catch (e: any) {
		return c.json({ success: false, error: e.message || "Something went wrong" }, 500);
	}
})

// Executa o server
serve({ fetch: app.fetch, port: 5000 });

/*
Função utilitaria para pegar a extensão de um arquivo.
*/
function extension(filename: string) {
	const parts = filename.split(".");

	return parts[parts.length - 1];
}