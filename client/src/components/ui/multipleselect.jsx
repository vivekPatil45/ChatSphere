"use client";

import { Command as CommandPrimitive, useCommandState } from "cmdk";
import { X } from "lucide-react";
import * as React from "react";
import { forwardRef, useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

function transToGroupOption(options, groupBy) {
  if (options.length === 0) {
    return {};
  }
  if (!groupBy) {
    return {
      "": options,
    };
  }

  const groupOption = {};
  options.forEach((option) => {
    const key = option[groupBy] || "";
    if (!groupOption[key]) {
      groupOption[key] = [];
    }
    groupOption[key].push(option);
  });
  return groupOption;
}

function removePickedOption(groupOption, picked) {
  const cloneOption = JSON.parse(JSON.stringify(groupOption));

  for (const [key, value] of Object.entries(cloneOption)) {
    cloneOption[key] = value.filter(
      (val) => !picked.find((p) => p.value === val.value)
    );
  }
  return cloneOption;
}

function isOptionsExist(groupOption, targetOption) {
  for (const [, value] of Object.entries(groupOption)) {
    if (
      value.some((option) => targetOption.find((p) => p.value === option.value))
    ) {
      return true;
    }
  }
  return false;
}

const CommandEmpty = forwardRef(({ className, ...props }, forwardedRef) => {
  const render = useCommandState((state) => state.filtered.count === 0);

  if (!render) return null;

  return (
    <div
      ref={forwardedRef}
      className={cn("py-6 text-center text-sm", className)}
      cmdk-empty=""
      role="presentation"
      {...props}
    />
  );
});

CommandEmpty.displayName = "CommandEmpty";

const MultipleSelector = React.forwardRef(
  (
    {
      value,
      onChange,
      placeholder,
      defaultOptions: arrayDefaultOptions = [],
      options: arrayOptions,
      delay,
      onSearch,
      loadingIndicator,
      emptyIndicator,
      maxSelected = Number.MAX_SAFE_INTEGER,
      onMaxSelected,
      hidePlaceholderWhenSelected,
      disabled,
      groupBy,
      className,
      badgeClassName,
      selectFirstItem = true,
      creatable = false,
      triggerSearchOnFocus = false,
      commandProps,
      inputProps,
      hideClearAllButton = false,
    },
    ref
  ) => {
    const inputRef = React.useRef(null);
    const containerRef = React.useRef(null);
    const [open, setOpen] = React.useState(false);
    const mouseOn = React.useRef(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const [selected, setSelected] = React.useState(value || []);
    const [options, setOptions] = React.useState(
      transToGroupOption(arrayDefaultOptions, groupBy)
    );
    const [inputValue, setInputValue] = React.useState("");
    const debouncedSearchTerm = useDebounce(inputValue, delay || 500);

    React.useImperativeHandle(
      ref,
      () => ({
        selectedValue: [...selected],
        input: inputRef.current,
        focus: () => inputRef.current?.focus(),
      }),
      [selected]
    );

    const handleUnselect = React.useCallback(
      (option) => {
        const newOptions = selected.filter((s) => s.value !== option.value);
        setSelected(newOptions);
        onChange?.(newOptions);
      },
      [onChange, selected]
    );

    const handleKeyDown = React.useCallback(
      (e) => {
        const input = inputRef.current;
        if (input) {
          if (e.key === "Delete" || e.key === "Backspace") {
            if (input.value === "" && selected.length > 0) {
              const lastSelectOption = selected[selected.length - 1];
              if (!lastSelectOption.fixed) {
                handleUnselect(selected[selected.length - 1]);
              }
            }
          }
          if (e.key === "Escape") {
            input.blur();
          }
        }
      },
      [handleUnselect, selected]
    );

    useEffect(() => {
      if (value) {
        setSelected(value);
      }
    }, [value]);

    useEffect(() => {
      if (!arrayOptions || onSearch) {
        return;
      }
      const newOption = transToGroupOption(arrayOptions || [], groupBy);
      if (JSON.stringify(newOption) !== JSON.stringify(options)) {
        setOptions(newOption);
      }
    }, [arrayDefaultOptions, arrayOptions, groupBy, onSearch, options]);

    useEffect(() => {
      const doSearch = async () => {
        setIsLoading(true);
        const res = await onSearch?.(debouncedSearchTerm);
        setOptions(transToGroupOption(res || [], groupBy));
        setIsLoading(false);
      };

      const exec = async () => {
        if (!onSearch || !open) return;

        if (triggerSearchOnFocus) {
          await doSearch();
        }

        if (debouncedSearchTerm) {
          await doSearch();
        }
      };

      void exec();
    }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus, onSearch]);

    const CreatableItem = () => {
      if (!creatable) return undefined;
      if (
        isOptionsExist(options, [{ value: inputValue, label: inputValue }]) ||
        selected.find((s) => s.value === inputValue)
      ) {
        return undefined;
      }

      const Item = (
        <CommandItem
          value={inputValue}
          className="cursor-pointer"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onSelect={(value) => {
            if (selected.length >= maxSelected) {
              onMaxSelected?.(selected.length);
              return;
            }
            setInputValue("");
            const newOptions = [...selected, { value, label: value }];
            setSelected(newOptions);
            onChange?.(newOptions);
          }}
        >
          {`Create "${inputValue}"`}
        </CommandItem>
      );

      if (!onSearch && inputValue.length > 0) {
        return Item;
      }

      if (onSearch && debouncedSearchTerm.length > 0 && !isLoading) {
        return Item;
      }

      return undefined;
    };

    const EmptyItem = React.useCallback(() => {
      if (!emptyIndicator) return undefined;

      if (onSearch && !creatable && Object.keys(options).length === 0) {
        return (
          <CommandItem value="-" disabled>
            {emptyIndicator}
          </CommandItem>
        );
      }

      return <CommandEmpty>{emptyIndicator}</CommandEmpty>;
    }, [creatable, emptyIndicator, onSearch, options]);

    const selectables = React.useMemo(
      () => removePickedOption(options, selected),
      [options, selected]
    );

    const commandFilter = React.useCallback(() => {
      if (commandProps?.filter) {
        return commandProps.filter;
      }

      if (creatable) {
        return (value, search) => {
          return value.toLowerCase().includes(search.toLowerCase()) ? 1 : -1;
        };
      }
      return undefined;
    }, [creatable, commandProps?.filter]);

    return (
      <div ref={containerRef} className="relative">
        <Command
          {...commandProps}
          onKeyDown={(e) => {
            handleKeyDown(e);
            commandProps?.onKeyDown?.(e);
          }}
          className={cn(
            "h-auto  overflow-visible bg-transparent ",
            commandProps?.className
          )}
          shouldFilter={
            commandProps?.shouldFilter !== undefined
              ? commandProps.shouldFilter
              : !onSearch
          }
          filter={commandFilter()}
        >
          <div
            className={cn(
              "min-h-10 px-5 rounded-md border border-input text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
              {
                "px-3 py-2": selected.length !== 0,
                "cursor-text": !disabled && selected.length !== 0,
              },
              className
            )}
            onClick={() => {
              if (disabled) return;
              inputRef.current?.focus();
            }}
          >
            <div className="relative flex flex-wrap gap-1">
              {selected.map((option) => {
                return (
                  <Badge
                    key={option.value}
                    className={cn(
                      "data-[disabled]:bg-muted-foreground data-[disabled]:text-muted data-[disabled]:hover:bg-muted-foreground",
                      "data-[fixed]:bg-muted-foreground data-[fixed]:text-muted data-[fixed]:hover:bg-muted-foreground",
                      badgeClassName
                    )}
                    data-disabled={disabled}
                    data-fixed={option.fixed}
                  >
                    {option.label}
                    <button
                      disabled={disabled || option.fixed}
                      className={cn(
                        "ml-1 rounded-full outline-none focus:outline-none",
                        "hover:bg-muted/70 hover:text-muted-foreground",
                        {
                          "cursor-not-allowed opacity-50":
                            disabled || option.fixed,
                        }
                      )}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleUnselect(option);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={() => {
                        handleUnselect(option);
                      }}
                      tabIndex={-1}
                      type="button"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
              <input
                disabled={disabled || selected.length >= maxSelected}
                ref={inputRef}
                className={cn(
                  "ml-1 min-w-[2px]  border-0 bg-transparent p-0 outline-none focus:outline-none disabled:cursor-not-allowed",
                  "placeholder:text-muted-foreground/80",
                  {
                    "w-32 flex-1": selected.length === 0,
                    hidden: hidePlaceholderWhenSelected && selected.length > 0,
                  },
                  inputProps?.className
                )}
                placeholder={selected.length === 0 ? placeholder : ""}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  inputProps?.onChange?.(e);
                }}
                onFocus={(e) => {
                  setOpen(true);
                  inputProps?.onFocus?.(e);
                }}
                onBlur={(e) => {
                  if (!mouseOn.current) {
                    setOpen(false);
                  }
                  inputProps?.onBlur?.(e);
                }}
                tabIndex={0}
                {...inputProps}
              />
            </div>
          </div>
          {selected.length > 0 && !hideClearAllButton && (
            <button
              disabled={disabled}
              className={cn(
                "ml-2 inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors",
                "hover:bg-muted/70 hover:text-muted-foreground text-white mt-2",
                "cursor-pointer disabled:cursor-not-allowed",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              )}
              onClick={() => {
                setSelected([]);
                onChange?.([]);
              }}
            >
              Clear All
            </button>
          )}
          {open && (
            <CommandPrimitive.List
              className={cn(
                "absolute z-10 mt-14  h-[25vh]  md:max-h-28  w-full overflow-auto rounded-md border border-input bg-popover shadow-lg ring-1 ring-ring focus:outline-none",
                "animate-in animate-out fade-in-0 zoom-in-95 fade-out-0 zoom-out-95"
              )}
              style={{
                width: containerRef.current
                  ? containerRef.current.clientWidth
                  : "100%",
              }}
            >
              {isLoading && (
                <CommandItem value="-" disabled>
                  {loadingIndicator}
                </CommandItem>
              )}
              {Object.keys(selectables).map((group) => {
                const items = selectables[group];
                if (items.length === 0) {
                  return null;
                }

                return (
                  <CommandGroup key={group} heading={group}>
                    {items.map((option, index) => (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onSelect={() => {
                          if (selected.length >= maxSelected) {
                            onMaxSelected?.(selected.length);
                            return;
                          }
                          setInputValue("");
                          const newOptions = [...selected, option];
                          setSelected(newOptions);
                          onChange?.(newOptions);
                        }}
                        className={cn("cursor-pointer", {
                          "border border-border":
                            index === 0 && selectFirstItem,
                        })}
                      >
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                );
              })}
              {CreatableItem()}
              {EmptyItem()}
            </CommandPrimitive.List>
          )}
        </Command>
      </div>
    );
  }
);

MultipleSelector.displayName = "MultipleSelector";

export default MultipleSelector;
