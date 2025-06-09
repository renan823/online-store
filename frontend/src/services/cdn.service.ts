import { useMutation } from "@tanstack/react-query";
import { cdn } from "./config";

/* 
Função salvar arquivos na CDN e seu hook
*/
async function uploadFiles(files: File[]): Promise<string[]> {
    // Criar payload de arquivos
    const payload = new FormData();
    for (const file of files) {
        payload.append("file[]", file);
    }

    const response = await cdn.post<string[]>('/upload', payload);
    if (response.status !== 200) {
        throw new Error("Failed to upload files.");
    }

    return response.data;
}

export function useUploadFiles() {
    return useMutation({
        "mutationKey": ["upload", "files"],
        mutationFn: uploadFiles,
    })
}

/*
Função para remover um ou mais imagems da CDN e seu hook
*/
async function deleteFiles(files: string[]): Promise<boolean> {
    const response = await cdn.delete<boolean>("/", { data : { files } });
    if (response.status !== 200) {
        throw new Error("Failed to delete files.");
    }

    return response.data;
}

export function useDeleteFiles() {
    return useMutation({
        "mutationKey": ["delete", "files"],
        mutationFn: deleteFiles,
        onError: (err) => console.log(err)
    })
}