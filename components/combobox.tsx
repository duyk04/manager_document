"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ActionTooltip } from "./action-tooltip";

interface ComBoBoxProps {
    options: { label: string; value: string }[];
    label?: string;
    onChange?: (value: string) => void;
}

export function Combobox({
    options, label, onChange
}: ComBoBoxProps) {
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState("");

    const handleSelect = (value: string) => {
        const newValue = value === selectedValue ? "" : value;
        setSelectedValue(newValue);
        onChange && onChange(newValue);
        setOpen(false);
    };

    return (
        <div className="flex items-center justify-center">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "w-min justify-between rounded-xl",
                            selectedValue ? "bg-blue-200/50 dark:bg-gray-800 rounded-xl rounded-r-none" : "bg-white dark:bg-gray-900"
                        )}
                    >
                        {selectedValue
                            ? options.find((option) => option.value === selectedValue)?.label
                            : label}
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-fit  p-0">
                    <Command>
                        <CommandInput placeholder="Search..." />
                        <CommandList>
                            <CommandEmpty>No options found.</CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.label}
                                        onSelect={() => handleSelect(option.value)}
                                    >
                                        {option.label}
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                selectedValue === option.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {selectedValue && (
                <ActionTooltip label="Xóa lựa chọn" side="bottom" align="center">
                    <button
                        onClick={() => handleSelect("")}
                        className="ms-[2px] right-0 p-2 bg-blue-200/50 flex-row items-center justify-center border rounded-xl rounded-l-none border-gray-200 dark:border-gray-700"
                    >
                        <X
                            className={cn(
                                "h-[22px] w-[22px] text-gray-400 dark:text-gray-500",
                                selectedValue ? "opacity-100" : "opacity-0"
                            )}
                        />
                    </button>
                </ActionTooltip>
            )}
        </div>
    );
}

