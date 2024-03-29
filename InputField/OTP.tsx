"use client";
import { AnimatePresence, motion } from "framer-motion";
import { InputField, type InputFieldProps } from "nextui/InputField";
import { Spinner } from "nextui/Spinner";
import { cn } from "nextui/util";
import { InputHTMLAttributes, forwardRef, useCallback } from "react";
import { MdCheckCircleOutline, MdErrorOutline, MdLockOutline } from "react-icons/md";

type Props = Omit<InputFieldProps, "before" | "after" | "options"> & Partial<{
	state: "error" | "success" | "loading";
}>;

export const InputFieldOTP = forwardRef<HTMLInputElement, Partial<Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & Props>>(function ({ color, className, state, ...props }, ref) {

	// Filter input
	const filter = useCallback(function (event: React.KeyboardEvent<HTMLInputElement> |
		React.DragEvent<HTMLInputElement> |
		React.ClipboardEvent<HTMLInputElement>) {
		const target = event.target as HTMLInputElement;
		switch (event.type) {

			// On key press
			case "keypress":
			case "keydown":
				event = event as React.KeyboardEvent<HTMLInputElement>;

				// Ignore if modifier key is pressed
				if (event.ctrlKey || event.altKey || event.metaKey) break;

				// Prevent cursor from bouncing around
				if (["Backspace", "Delete"].includes(event.key)) {

					// Get the string that the user is trying to delete
					const { value } = target;
					const start = target.selectionStart;
					const end = target.selectionEnd;

					// Prevent the cursor from jumping around
					switch (event.key) {
						case "Backspace": {
							const selection = start && value.slice(start - 1, end ?? start);
							if (start === 5 && end === 5 && value.length !== 5) {
								target.value = target.value.replace(`-${selection}`, "");
								target.dispatchEvent(new Event("input", { bubbles: true }));
								target.setSelectionRange(4, 4);
							}
							break;
						}
						case "Delete": {
							const selection = start && value.slice(start, (end ?? start) + 1);
							if (start === 4 && end === 4 && value.length !== 5) {
								target.value = target.value.replace(`-${selection}`, "");
								target.dispatchEvent(new Event("input", { bubbles: true }));
								target.setSelectionRange(4, 4);
								event.preventDefault();
							}
							break;
						}
					}
					break;
				}

				// Ignore if not a number
				if (event.key.replace(/\D/g, "") !== event.key && event.key.length === 1) event.preventDefault();

				props.onKeyDown?.(event);
				break;

			// On paste
			case "paste":
				event.preventDefault();
				event = event as React.ClipboardEvent<HTMLInputElement>;
				target.value = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
				props.onPaste?.(event);
				break;

			// On drop
			case "drop":
				event.preventDefault();
				event = event as React.DragEvent<HTMLInputElement>;
				target.value = event.dataTransfer.getData("text").replace(/\D/g, "").slice(0, 6);
				props.onDrop?.(event);
				break;

		}
	}, [props]);

	// Format input
	const format = useCallback(function (event: React.FormEvent<HTMLInputElement>) {
		const target = event.target as HTMLInputElement;
		let { selectionStart, selectionEnd } = target;
		target.value = target.value
			.replace(/\D/g, "")
			.slice(0, 6)
			.split(/(?<=^.{3})/)
			.filter(Boolean)
			.join("-");

		// if (target.value.length === 5 && selectionEnd === 4) {
		if (selectionEnd === 4) {
			selectionEnd++;
			selectionStart && selectionStart++;
		}

		target.setSelectionRange(selectionStart, selectionEnd);
	}, []);

	const StatusIndicator = useCallback(function StatusIndicator() {
		if (state === "loading") return <Spinner className="shrink-0 w-5" color={color} />;
		if (state === "success") return <MdCheckCircleOutline className="text-xl text-success" />;
		if (state === "error") return <MdErrorOutline className="text-xl text-error" />;
		return <MdLockOutline className="text-xl" />;
	}, [color, state]);

	return <InputField
		{...props}
		after={(
			<div className="w-5 aspect-square relative">
				<AnimatePresence>
					<motion.div
						animate={{ scale: 1 }}
						className="w-5 aspect-square absolute inset-0 flex items-center justify-center"
						initial={{ scale: 0 }}
						key={state || "default"}
						transition={{ duration: 0.1 }}>
						<StatusIndicator />
					</motion.div>
				</AnimatePresence>
			</div>
		)}
		className={cn("tracking-[2.5px]", className)}
		onDrop={filter}
		color={color || state && ["error","success"].includes(state) ? state as "error" | "success" : undefined || color } 
		onInput={format}
		onKeyDown={filter}
		onPaste={filter}
		ref={ref} />;
});
