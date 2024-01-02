"use client";

import { PropsWithChildren, createContext, useContext, useState } from "react";
import { IconType } from "react-icons";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdErrorOutline } from "react-icons/md";
import { Color, Toast } from ".";
import { Dismissible, DismissibleOptions } from "./Dismissible";

interface IToastContext {

	/*
	 * Push a toast to the stack
	 * @param node The node to push
	 * @param options The options
	 */
	push(node: JSX.Element, options?: Partial<DismissibleOptions>): void;

	/*
	 * Dismiss a toast from the stack
	 * @param id The id of the toast to dismiss
	 */
	dismiss(id: string): void;

}

interface ToastInitOptions {
	title: string;
	message: string;
	icon: IconType;
	iconColor: "primary" | "neutral" | "error" | "success" | "warning";
}

interface ToastBuilders {

	/*
	 * Display an error toast
	 * @param message The message to display
	 * @param options The options to pass to the toast
	 */
	error(message: string): void;
	error(message: string, options: Partial<DismissibleOptions>): void;
	error(options: Partial<DismissibleOptions & ToastInitOptions> & Pick<ToastInitOptions, "message">): void;

	/*
	 * Display a success toast
	 * @param message The message to display
	 * @param options The options to pass to the toast
	 */
	success(message: string): void;
	success(message: string, options: Partial<DismissibleOptions>): void;
	success(options: Partial<DismissibleOptions & ToastInitOptions> & Pick<ToastInitOptions, "message">): void;

	/*
	 * Display a warning toast
	 * @param message The message to display
	 * @param options The options to pass to the toast
	 */
	warning(message: string): void;
	warning(message: string, options: Partial<DismissibleOptions>): void;
	warning(options: Partial<DismissibleOptions & ToastInitOptions> & Pick<ToastInitOptions, "message">): void;

}

// Create a context for the toast provider with default values
const ToastContext = createContext<IToastContext & ToastBuilders>({
	push() { },
	dismiss() { },
	error() { },
	success() { },
	warning() { },
});

// Create a hook to use the toast provider
export function useToasts() {
	return useContext(ToastContext);
}

// Create a toast provider
export function ToastProvider({ children }: PropsWithChildren) {

	// Initialize state
	const [ state, setState ] = useState<Record<string, { node: JSX.Element; options: Partial<DismissibleOptions> }>>({});

	// temp function to push a node to the stack
	function push(node: JSX.Element, options: Partial<DismissibleOptions> = {}) {

		// Generate an id
		const id = Math.random().toString(36).substring(2, 9);

		// Add the node to the state
		setState(state => ({ [id]: {
			node,
			options,
		}, ...state }));

	}

	// Remove a toast from the stack
	function dismiss(id: string) {
		setState(state => {
			delete state[id];
			return state;
		});
	}

	type ToastOpts = Partial<DismissibleOptions> & Partial<DismissibleOptions & ToastInitOptions> & Pick<ToastInitOptions, "message" | "iconColor" | "icon">;

	function pushByOptions(opts: ToastOpts) {
		push((
			<Toast icon={ opts.icon } iconColor={ opts.iconColor as Color }>
				{ opts.title ? (
					<div>
						<h1>{ opts.title }</h1>
						<p>{ opts.message }</p>
					</div>
				) : (
					<span>{ opts.message }</span>
				) }
			</Toast>), opts
		);
	}

	function error(message: string | Partial<DismissibleOptions & ToastInitOptions> & Pick<ToastInitOptions, "message">, options?: Partial<DismissibleOptions>) {
		const defaults = {
			duration: 10000,
			icon: MdErrorOutline,
			iconColor: "error",
		};
		const opts = (typeof message === "string" ? { ...defaults, ...options, message } : { ...defaults, ...message }) as ToastOpts;
		pushByOptions(opts);
	}

	function success(message: string | Partial<DismissibleOptions & ToastInitOptions> & Pick<ToastInitOptions, "message">, options?: Partial<DismissibleOptions>) {
		const defaults = {
			duration: 5000,
			icon: IoMdCheckmarkCircleOutline,
			iconColor: "success",
		};
		const opts = (typeof message === "string" ? { ...defaults, ...options, message } : { ...defaults, ...message }) as ToastOpts;
		pushByOptions(opts);
	}

	function warning(message: string | Partial<DismissibleOptions & ToastInitOptions> & Pick<ToastInitOptions, "message">, options?: Partial<DismissibleOptions>) {
		const defaults = {
			duration: 10000,
			icon: MdErrorOutline,
			iconColor: "warning",
		};
		const opts = (typeof message === "string" ? { ...defaults, ...options, message } : { ...defaults, ...message }) as ToastOpts;
		pushByOptions(opts);
	}

	return <ToastContext.Provider value={{ push, dismiss, error, success, warning }}>
		
		<div className="fixed inset-0 z-30 pointer-events-none">
			<div className="absolute bottom-0 right-0 flex flex-col w-full max-w-lg p-4 lg:m-8 xl:m-16 2xl:m-24 2xl:bottom-auto 2xl:top-0 2xl:flex-col-reverse [&>*]:pointer-events-auto overflow-visible">
				
				{ /* Toasts */ }
				{ Object.keys(state).map(key => <div key={ key }>
					<Dismissible { ...state[key].options } onDismiss={ () => dismiss(key) }>{ state[key].node }</Dismissible>
				</div>) }

			</div>
		</div>

		{ /* Children */ }
		{ children }
			
	</ToastContext.Provider>;
}