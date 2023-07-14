"use client";

import { PropsWithChildren, createContext, useContext, useState } from "react";
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

// Create a context for the toast provider with default values
const ToastContext = createContext<IToastContext>({
	push() { },
	dismiss() { },
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

	return <ToastContext.Provider value={{ push, dismiss }}>
		
		<div className="fixed inset-0 z-30 pointer-events-none">
			<div className="absolute bottom-0 right-0 flex flex-col w-full max-w-lg p-4 lg:m-8 xl:m-16 2xl:m-24 2xl:bottom-auto 2xl:top-0 2xl:flex-col-reverse [&>*]:pointer-events-auto overflow-visible">
				
				{/* Toasts */}
				{Object.keys(state).map(key => <div key={key}>
					<Dismissible {...state[key].options} onDismiss={ () => dismiss(key) }>{state[key].node}</Dismissible>
				</div>)}

			</div>
		</div>

		{/* Children */}
		{children}
			
	</ToastContext.Provider>;
}