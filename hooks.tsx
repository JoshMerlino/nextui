import { useCallback, useEffect, type RefObject } from "react";

export function useFocusLost<T extends HTMLElement>(ref: RefObject<T>, callback: (event: MouseEvent | TouchEvent | FocusEvent) => unknown) {

	const handleClickOutside = useCallback(function(event: MouseEvent | TouchEvent) {
		if (ref.current && !ref.current.contains(event.target as Node)) callback(event);
	}, [ ref, callback ]);
	
	const handleFocusShift = useCallback(function(event: FocusEvent) {
		if (ref.current && !ref.current.contains(event.relatedTarget as Node)) callback(event);
	}, [ ref, callback ]);

	useEffect(function() {
		const element = ref.current;
		if (!element) return;
		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("touchstart", handleClickOutside);
		element.addEventListener("focusout", handleFocusShift);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("touchstart", handleClickOutside);
			element.removeEventListener("focusout", handleFocusShift);
		};
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

	const handleEvent = useCallback(function(event: WindowEventMap[T]) {
		callback(event);
	}, [ callback ]);

	useEffect(function() {
		window.addEventListener(event, handleEvent);
		return () => window.removeEventListener(event, handleEvent);
	}, [ event, handleEvent ]);

}