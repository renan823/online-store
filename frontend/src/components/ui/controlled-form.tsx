import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control, Controller, FieldError } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ScrollArea } from "./scroll-area";

interface FieldErrorProps {
    error: FieldError | undefined
}

export default function ControlledFieldError({ error }: FieldErrorProps) {
    if (!error) {
        return (
            <></>
        )
    }

    return (
        <p className="text-red-500 text-sm mt-1">{error.message}</p>
    )
}

interface ControlledCheckboxProps {
    name: string;
    control: Control<any>;
    value: boolean;
}

export function ControlledCheckbox({ name, control, value }: ControlledCheckboxProps) {
    return (
        <Controller
            name={name}
            control={control}
            defaultValue={value}
            render={({ field }) => (
                <Checkbox
                    className="border-1 border-solid border-primary size-5"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                />
            )}
        />
    )
}

interface ControlledTextInputProps {
    name: string;
    control: Control<any>;
    placeholder: string;
    value?: string;
}

export function ControlledTextInput({ name, control, placeholder, value }: ControlledTextInputProps) {
    return (
        <Controller
            name={name}
            defaultValue={value}
            control={control}
            render={({ field }) => (
                <Input placeholder={placeholder} {...field} autoComplete="off" />
            )}
        />
    )
}

interface ControlledEmailInputProps {
    name: string;
    control: Control<any>;
    placeholder: string;
    value?: string;
}

export function ControlledEmailInput({ name, control, placeholder, value }: ControlledEmailInputProps) {
    return (
        <Controller
            name={name}
            defaultValue={value}
            control={control}
            render={({ field }) => (
                <Input placeholder={placeholder} type="email" {...field} autoComplete="off" />
            )}
        />
    )
}

interface ControlledPasswordInputProps {
    name: string;
    control: Control<any>;
    placeholder: string;
    value?: string;
}

export function ControlledPasswordInput({ name, control, placeholder, value }: ControlledPasswordInputProps) {
    return (
        <Controller
            name={name}
            defaultValue={value}
            control={control}
            render={({ field }) => (
                <Input placeholder={placeholder} type="password" {...field} autoComplete="off" />
            )}
        />
    )
}

interface ControlledFileInputProps {
    name: string;
    control: Control<any>;
}

export function ControlledFileInput({ name, control }: ControlledFileInputProps) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <Input type="file" onChange={evt => field.onChange(evt.target.files?.[0])} />
            )}
        />
    )
}

interface ControlledMultipleFileInputProps {
    name: string;
    control: Control<any>;
}

export function ControlledMultipleFileInput({ name, control }: ControlledMultipleFileInputProps) {
    return (
        <Controller
            name={name}
            control={control}
            defaultValue={[]}
            render={({ field }) => {
                const files: File[] = field.value || [];

                const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
                    if (!e.target.files) return;
                    const selectedFiles = Array.from(e.target.files);
                    field.onChange([...files, ...selectedFiles]);
                };

                const handleRemove = (index: number) => {
                    const updatedFiles = [...files];
                    updatedFiles.splice(index, 1);
                    field.onChange(updatedFiles);
                };

                return (
                    <div className="space-y-4">
                        <Input type="file" multiple accept="image/*" onChange={handleAddFiles} />

                        <ScrollArea className="h-[25vh]">
                            {files.length > 0 && (
                                <div className="grid gap-2">
                                    {files.map((file, index) => (
                                        <Card key={index} className="flex-row items-center justify-between p-2 rounded-sm">
                                            <CardContent className="flex flex-row gap-2 p-0">
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={file.name}
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                                <div>
                                                    <p className="text-sm">{file.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {(file.size / 1024).toFixed(1)} KB
                                                    </p>
                                                </div>
                                            </CardContent>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemove(index)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                );
            }}
        />
    );
}

interface ControlledNumberInputProps {
    name: string;
    control: Control<any>;
}

export function ControlledNumberInput({ name, control }: ControlledNumberInputProps) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <Input type="number" {...field} />
            )}
        />
    )
}

interface ControlledSelectorItem {
    name: string;
    value: string;
}

interface ControlledSelectorProps {
    name: string;
    control: Control<any>;
    placeholder: string;
    items: ControlledSelectorItem[]
}

export function ControlledSelector({ name, control, placeholder, items }: ControlledSelectorProps) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            items.map((item, index) => {
                                return (
                                    <SelectItem key={index} value={item.value}>{item.name}</SelectItem>
                                )
                            })
                        }
                    </SelectContent>
                </Select>
            )}
        />
    )
}