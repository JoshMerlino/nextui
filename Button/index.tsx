import { ClassValue } from "clsx";
import { ButtonHTMLAttributes } from "react";
import { IconType } from "react-icons";
import { Ripple } from "../Ripple";
import { Spinner } from "../Spinner";
import { cn } from "../util";
import "./index.css";

interface Props {
  size: "small" | "medium" | "large" | "md:large";
  color: "primary" | "neutral" | "error" | "warning" | "success";
  variant: "raised" | "outlined" | "flat";
  disableRipple: boolean;
  iconPosition: "before" | "after";
  icon: IconType;
  loading: boolean;
}

export function Button(
  {
    children,
    icon: Icon,
    className,
    size = "medium",
    color = "primary",
    variant = "raised",
    loading,
    iconPosition = "before",
    disableRipple,
    ...props
  }: ButtonHTMLAttributes<HTMLButtonElement> & Partial<Props>
) {
  const classes: ClassValue[] = [

    // base
    "w-min rounded-md font-medium uppercase tracking-[0.75px] duration-150 select-none appearance-none relative overflow-hidden whitespace-nowrap flex items-center gap-2 focus:outline-0 isolate justify-center",

    // sizes
    {
      "px-4 h-9 py-1 text-sm": true,
      "px-3 h-7 py-0.5 text-xs": size === "small",
      "md:px-6 md:h-11 md:py-2 md:text-base": size === "md:large",
      "px-6 h-11 py-2 text-base": size === "large",
    },

    className,
  ];

  const ripple: ClassValue[] = [];

  switch (variant) {

    // RAISED (default)
    default:
      classes.push({
        "shadow-md hover:shadow-lg": true,

        // solid backgrounds (no opacity utils needed)
        "text-white bg-gray-500 hover:bg-gray-600 focus:bg-gray-600 active:bg-gray-700":
          color === "neutral",
        "text-primary-text bg-primary-600 hover:bg-primary-700 focus:bg-primary-700 active:bg-primary-800":
          color === "primary",
        "text-error-text bg-error-600 hover:bg-error-700 focus:bg-error-700 active:bg-error-800":
          color === "error",
        "text-success-text bg-success-600 hover:bg-success-700 focus:bg-success-700 active:bg-success-800":
          color === "success",
        "text-warning-text bg-warning-600 hover:bg-warning-700 focus:bg-warning-700 active:bg-warning-800":
          color === "warning",

        // disabled (keep /40 which is valid in v4)
        "text-gray-500 dark:text-gray-400 bg-gray-500/40! cursor-not-allowed shadow-sm!":
          props.disabled,
      });

      ripple.push({
        "bg-primary-text": color === "primary",
        "bg-error-text": color === "error",
        "bg-success-text": color === "success",
        "bg-warning-text": color === "warning",
        "bg-white": color === "neutral",
      });
      break;

    // OUTLINED
    case "outlined": {

      // v4: replace border-opacity-* with color alpha
      classes.push({
        "border bg-transparent": true,

        // default/hover/focus/active widths/colors via alpha suffixes
        "border-gray-500/50 hover:border-gray-500/100 focus:border-gray-500/100 active:border-gray-500/100":
          color === "neutral",
        "border-primary/50 hover:border-primary/100 focus:border-primary/100 active:border-primary/100":
          color === "primary",
        "border-error/50 hover:border-error/100 focus:border-error/100 active:border-error/100":
          color === "error",
        "border-success/50 hover:border-success/100 focus:border-success/100 active:border-success/100":
          color === "success",
        "border-warning/50 hover:border-warning/100 focus:border-warning/100 active:border-warning/100":
          color === "warning",

        // disabled
        "cursor-not-allowed":
          props.disabled,
        "border-gray-500/25 text-gray-500/75":
          props.disabled,
      });

      // fall through to flat-ish ripple/background handling below if you want,
      // but keeping outlined with transparent bg (no alpha utilities needed)
      break;
    }

    // FLAT
    case "flat": {

      // Ripple tint (use alpha on color)
      ripple.push({
        "bg-gray-500/50": color === "neutral",
        "bg-primary/50": color === "primary",
        "bg-error/50": color === "error",
        "bg-success/50": color === "success",
        "bg-warning/50": color === "warning",
      });

      // v4: replace bg-opacity-* with color/alpha utilities
      classes.push({

        // base state
        "bg-transparent": true,

        // disabled
        "bg-transparent! text-gray-500/75! cursor-not-allowed border-gray-500/25":
          props.disabled,

        // neutral
        "text-gray-800 dark:text-gray-200 bg-gray-500/0 hover:bg-gray-500/10 focus:bg-gray-500/[.15]":
          !props.disabled && color === "neutral",

        // colored text with subtle color wash on hover/focus
        "text-primary bg-primary/0 hover:bg-primary/10 focus:bg-primary/[.15]":
          !props.disabled && color === "primary",
        "text-error bg-error/0 hover:bg-error/10 focus:bg-error/[.15]":
          !props.disabled && color === "error",
        "text-success bg-success/0 hover:bg-success/10 focus:bg-success/[.15]":
          !props.disabled && color === "success",
        "text-warning bg-warning/0 hover:bg-warning/10 focus:bg-warning/[.15]":
          !props.disabled && color === "warning",

        // active state intensity based on ripple toggle
        "active:bg-gray-500/20": !props.disabled && color === "neutral" && !!disableRipple,
        "active:bg-gray-500/10": !props.disabled && color === "neutral" && !disableRipple,

        "active:bg-primary/20": !props.disabled && color === "primary" && !!disableRipple,
        "active:bg-primary/10": !props.disabled && color === "primary" && !disableRipple,

        "active:bg-error/20": !props.disabled && color === "error" && !!disableRipple,
        "active:bg-error/10": !props.disabled && color === "error" && !disableRipple,

        "active:bg-success/20": !props.disabled && color === "success" && !!disableRipple,
        "active:bg-success/10": !props.disabled && color === "success" && !disableRipple,

        "active:bg-warning/20": !props.disabled && color === "warning" && !!disableRipple,
        "active:bg-warning/10": !props.disabled && color === "warning" && !disableRipple,
      });
      break;
    }
  }

  return (
	<button { ...props } className={ cn(classes) }>
		{ /* Ripple */ }
		{ (props.disabled || disableRipple) ? null : <Ripple className={ ripple } /> }

		{ /* Icon */ }
		{ !!Icon && iconPosition === "before" && !loading && (
			<Icon
          className={ cn(
            "shrink-0",
            size === "large" ? "text-2xl" : size === "small" ? "text-lg" : "text-xl"
          ) }
        />
      ) }
		{ loading && iconPosition === "before" && (
			<Spinner
          className={ cn(
            "shrink-0",
            size === "md:large"
              ? "md:w-6"
              : size === "large"
              ? "w-6"
              : size === "small"
              ? "w-4"
              : "w-5",
            variant === "raised" && "stroke-current! text-inherit"
          ) }
          color={ color }
        />
      ) }

		{ /* Children */ }
		{ children }

		{ /* Icon */ }
		{ !!Icon && iconPosition === "after" && !loading && (
			<Icon
          className={ cn(
            "shrink-0",
            size === "md:large"
              ? "md:text-2xl"
              : size === "large"
              ? "text-2xl"
              : size === "small"
              ? "text-lg"
              : "text-xl"
          ) }
        />
      ) }
		{ loading && iconPosition === "after" && (
			<Spinner
          className={ cn(
            "shrink-0",
            size === "md:large"
              ? "md:w-6"
              : size === "large"
              ? "w-6"
              : size === "small"
              ? "w-4"
              : "w-5",
            variant === "raised" && "stroke-current! text-inherit"
          ) }
          color={ color }
        />
      ) }
	</button>
  );
}
