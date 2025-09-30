import { ClassValue } from "clsx";
import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../util";

interface Props {
  color: "primary" | "neutral" | "error" | "warning" | "success";
  variant: "default" | "legacy";
  icon?: ReactNode;
}

export const Switch = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & Partial<Props>>(function Switch(
  { color = "neutral", className, variant = "default", children, icon, ...props },
  ref
) {

  // unique id
  props.id = props.id || Math.floor(Math.random() * 1e10).toString(36);

  // TRACK
  const track: ClassValue[] = [

    // base
    "appearance-none peer focus:outline-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50",

    // variant base
    variant === "default" && "border-2 w-[52px] h-8 checked:border-transparent dark:checked:border-transparent bg-gray-200 border-gray-500 disabled:bg-gray-300! dark:disabled:bg-gray-800! dark:bg-gray-800 dark:border-gray-400 disabled:opacity-25 checked:disabled:opacity-50",
    variant === "legacy" && "w-[34px] h-[14px] bg-gray-300 dark:bg-gray-500",

    // colors (checked state)
    {
      "checked:bg-primary dark:checked:bg-primary": variant === "default" && color === "primary",
      "checked:bg-gray-500 dark:checked:bg-gray-500": variant === "default" && color === "neutral",
      "checked:bg-error dark:checked:bg-error": variant === "default" && color === "error",
      "checked:bg-warning dark:checked:bg-warning": variant === "default" && color === "warning",
      "checked:bg-success dark:checked:bg-success": variant === "default" && color === "success",

      // legacy: use alpha instead of bg-opacity-50
      "checked:bg-primary/50 dark:checked:bg-primary/50 disabled:checked:bg-primary/50!":
        variant === "legacy" && color === "primary",
      "checked:bg-gray-500/50 dark:checked:bg-gray-500/50 disabled:checked:bg-gray-500/50!":
        variant === "legacy" && color === "neutral",
      "checked:bg-error/50 dark:checked:bg-error/50 disabled:checked:bg-error/50!":
        variant === "legacy" && color === "error",
      "checked:bg-warning/50 dark:checked:bg-warning/50 disabled:checked:bg-warning/50!":
        variant === "legacy" && color === "warning",
      "checked:bg-success/50 dark:checked:bg-success/50 disabled:checked:bg-success/50!":
        variant === "legacy" && color === "success",
    },
  ];

  // THUMB
  const thumb: ClassValue[] = [

    // base
    "aspect-square w-4 absolute inset-0 rounded-full transition-all text-transparent flex items-center justify-center peer-disabled:cursor-not-allowed bg-gray-500 peer-checked:bg-white z-2",

    // variant specifics
    variant === "default" &&
      "peer-disabled:opacity-50 m-2 peer-checked:m-1 group-active/switch:peer-checked:m-0.5 peer-checked:w-6 pointer-events-none peer-checked:bg-white peer-checked:ml-6 group-active/switch:peer-checked:ml-[22px] peer-disabled:peer-checked:text-inherit! peer-disabled:text-[0px] dark:bg-gray-400 peer-disabled:opacity-25 peer-checked:peer-disabled:opacity-50 group-active/switch:peer-checked:w-7 peer-disabled:peer-checked:w-6! peer-disabled:peer-checked:mt-1! peer-disabled:peer-checked:ml-6!",
    variant === "legacy" &&
      "w-5 bg-gray-100 shadow-sm shadow-black/20 -mt-[3px] peer-checked:ml-3.5 peer-disabled:bg-gray-400 peer-disabled:peer-checked:bg-current peer-checked:bg-current peer-disabled:grayscale-[0.5] text-[0px]",

    // text color for icon/checkmark when checked
    {
      "peer-checked:text-primary": color === "primary",
      "peer-checked:text-gray-500": color === "neutral",
      "peer-checked:text-error": color === "error",
      "peer-checked:text-warning": color === "warning",
      "peer-checked:text-success": color === "success",
    },

    // default variant: filled thumb tint in checked state
    variant === "default" && !props.disabled && {
      "peer-checked:bg-primary-text": color === "primary",
      "peer-checked:bg-error-text": color === "error",
      "peer-checked:bg-warning-text": color === "warning",
      "peer-checked:bg-success-text": color === "success",
    },

    // legacy neutral dark tweak
    variant === "legacy" && color === "neutral" && "dark:peer-checked:bg-gray-300",

    // ripple-ish focus/press ring on thumb (kept as before)
    !props.disabled &&
      "after:content[''] after:bg-gray-500 peer-checked:after:bg-current after:opacity-20 after:absolute after:w-12 after:h-12 after:left-1/2 after:top-1/2 after:rounded-full after:-translate-x-1/2 after:-translate-y-1/2 after:pointer-events-none after:-z-1 after:scale-0 peer-focus:after:scale-100 group-active/checkbox:after:scale-100 duration-100 after:transition-transform after:z-1",

    // checkmark animation (when you pass an SVG icon child)
    !icon && "[&>svg]:scale-0 peer-checked:[&>svg]:scale-100 [&>svg]:transition-transform duration-100",
  ];

  return (
	<div className={ cn("flex items-center gap-4 mr-auto group/checkbox font-roboto isolate", className) }>
		<div className="relative flex group/switch">
			<input className={ cn(track) } ref={ ref } type="checkbox" { ...props } />
			<label className={ cn(thumb) } htmlFor={ props.id }>
				{ icon }
			</label>
		</div>
		{ children && (
			<label className={ cn("select-none", className) } htmlFor={ props.id }>
				{ children }
			</label>
      ) }
	</div>
  );
});
