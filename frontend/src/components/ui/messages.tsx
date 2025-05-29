import { AlertTriangle, Ban, Loader2 } from "lucide-react";

interface MessageProps {
    message: string;
}

export function LoadingMessage({ message }: MessageProps) {
	return (
		<div className="flex flex-col items-center justify-center h-80 p-10 text-muted-foreground">
			<Loader2 className="w-8 h-8 animate-spin mb-2" />
			<span className="text-xl">{message}</span>
		</div>
	);
}

export function EmptyMessage({ message }: MessageProps) {
	return (
		<div className="flex flex-col items-center justify-center h-80 p-10 text-muted-foreground">
			<Ban className="w-8 h-8 mb-2" />
			<span className="text-lg">{message}</span>
		</div>
	);
}

export function ErrorMessage({ message }: MessageProps) {
	return (
		<div className="flex flex-col items-center justify-center h-80 p-10 text-red-500">
			<AlertTriangle className="w-8 h-8 mb-2" />
			<span className="text-xl text-center">{message}</span>
		</div>
	);
}
