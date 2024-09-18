import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactElement;
  endIcon?: React.ReactElement;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, endIcon, ...props }, ref) => {
    const StartIcon = startIcon;
    const EndIcon = endIcon;

    return (
      <div className="w-full relative">
        {StartIcon && (
          <div className="absolute left-2.5 mr-1 top-1/2 transform -translate-y-1/2">
            {startIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex w-full shadow-none text-right text-sm border-0 bg-transparent focus:shadow-none outline-none focus:outline-none placeholder:text-neutrals-7 placeholder:italic disabled:cursor-not-allowed disabled:opacity-50",
            startIcon ? "pl-8" : "",
            endIcon ? "pr-8" : "",
            className
          )}
          ref={ref}
          {...props}
        />
        {EndIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {endIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
