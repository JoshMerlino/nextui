import { useCallback, useEffect, useRef, type RefObject } from "react";

export function useFocusLost<T extends HTMLElement>(ref: RefObject<T | null>, callback: (event: MouseEvent | TouchEvent | FocusEvent) => unknown) {

	const handleClickOutside = useCallback(function(event: MouseEvent | TouchEvent) {
		if (ref.current && !ref.current.contains(event.target as Node)) callback(event);
	}, [ ref, callback ]);
	
	const handleFocusShift = useCallback(function(event: FocusEvent) {
		if ((event.target as HTMLButtonElement).disabled) return;
		if (!ref.current) return;
		if (ref.current.contains(event.relatedTarget as Node)) return;
		if (ref.current === event.relatedTarget) return;
		if (ref.current.contains(event.target as Node)) return;
		if (ref.current === event.target) return;
		callback(event);
	}, [ ref, callback ]);

	useEffect(function() {
		const element = ref.current;
		if (!element) return;
		const controller = new AbortController();
		document.addEventListener("mousedown", handleClickOutside, { signal: controller.signal });
		document.addEventListener("touchstart", handleClickOutside, { signal: controller.signal });
		element.addEventListener("focusout", handleFocusShift, { signal: controller.signal });
		window.addEventListener("blur", callback, { signal: controller.signal });
		return () => controller.abort();
	}, [ ref, callback, handleClickOutside, handleFocusShift ]);
}

type Keybind = string | { key: string, ctrl?: boolean, shift?: boolean, alt?: boolean, meta?: boolean };

export function useKeybind(bind: Keybind, callback: (event: KeyboardEvent) => unknown) {

	const handleKeyPress = useCallback(function(event: KeyboardEvent) {
		if (typeof bind === "string") {
			if (event.key === bind) callback(event);
		} else {
			const { key, ctrl, shift, alt, meta } = bind;
			if (event.key === key && event.ctrlKey === ctrl && event.shiftKey === shift && event.altKey === alt && event.metaKey === meta) callback(event);
		}
	}, [ bind, callback ]);

	useEffect(function() {
		document.addEventListener("keydown", handleKeyPress);
		return () => document.removeEventListener("keydown", handleKeyPress);
	}, [ handleKeyPress ]);

}

export function useEvent<T extends keyof WindowEventMap>(event: T, callback: (event: WindowEventMap[T]) => unknown) {
	const handleEvent = useCallback((event: WindowEventMap[T]) => callback(event), [ callback ]);
	useEffect(function() {
		const controller = new AbortController();
		window.addEventListener(event, handleEvent, { signal: controller.signal });
		return () => controller.abort();
	}, [ event, handleEvent ]);
}

export function useConvergedRef<T>(ref?: React.Ref<T>) {
	const internalRef = useRef<T>(null);
	useEffect(() => {
		const currentRef = internalRef.current;
		if (ref && typeof ref === "function") ref(currentRef);
		else if (ref) ref.current = currentRef;
	}, [ internalRef, ref ]);
	return internalRef;
}

export function useEventMap<T extends HTMLElement | null>(ref: RefObject<T>, customEvents: Partial<{
    [K in keyof HTMLElementEventMap]: (this: Exclude<T, null>, event: HTMLElementEventMap[K] & { target: T; }) => void;
}> = {}) {
	useEffect(function() {
		const controller = new AbortController();
		const current = ref.current;
		if (!current) return;
		for (const [ event, handler ] of Object.entries(customEvents)) current.addEventListener(event as keyof HTMLElementEventMap, handler as EventListener, { signal: controller.signal });
		return () => controller.abort();
	}, [ ref, customEvents ]);
}

