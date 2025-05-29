import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control, Controller, FieldError } from "react-hook-form";

interface FieldErrorProps {
    error: FieldError | undefined
}

export default function ControlledFieldError({ error }: FieldErrorProps) {
    if (!error) {
        return(
            <></>
        )
    }

    return( 
        <p className="text-red-500 text-sm mt-1">{error.message}</p>
    )
}

interface ControlledCheckboxProps {
    name: string;
    control: Control<any>;
    value: boolean;
}

export function ControlledCheckbox({ name, control, value}: ControlledCheckboxProps) {
    return(
        <Controller
            name={name}
            control={control}
            defaultValue={value} 
            render={({ field }) => (
                <Checkbox
                    className="size-5"
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
    return(
        <Controller
            name={name}
            defaultValue={value}
            control={control}
            render={({ field }) => (
                <Input placeholder={placeholder} {...field} autoComplete="off"/>
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
    return(
        <Controller
            name={name}
            defaultValue={value}
            control={control}
            render={({ field }) => (
                <Input placeholder={placeholder} type="email" {...field} autoComplete="off"/>
            )}
        />
    )
}

interface ControlledPasswordInputProps {
    name: string;
    control: Control<any>;
    value?: string;
}

export function ControlledPasswordInput({ name, control, value }: ControlledPasswordInputProps) {
    return(
        <Controller
            name={name}
            defaultValue={value}
            control={control}
            render={({ field }) => (
                <Input type="password" {...field} autoComplete="off"/>
            )}
        />
    )
}



interface ControlledFileInputProps {
    name: string;
    control: Control<any>;
}

export function ControlledFileInput({ name, control }: ControlledFileInputProps) {
    return(
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <Input type="file" onChange={evt => field.onChange(evt.target.files?.[0])}/>
            )}
        />
    )
}

interface ControlledNumberInputProps {
    name: string;
    control: Control<any>;
}

export function ControlledNumberInput({ name, control }: ControlledNumberInputProps) {
    return(
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <Input type="number" {...field}/>
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
    return(
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                        <SelectValue placeholder={placeholder}/>
                    </SelectTrigger>
                    <SelectContent>
                        {
                            items.map((item, index) => {
                                return(
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