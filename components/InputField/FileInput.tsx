import { omit, pick } from "lodash";
import { Button } from "nextui/Button";
import { useConvergedRef, useEventMap } from "nextui/hooks";
import { forwardRef, useEffect, useState } from "react";
import { BUTTON_PROPS } from ".";
import BaseInput from "./BaseInput";

export default forwardRef<HTMLInputElement, ExtractProps<typeof BaseInput> & Pick<ExtractProps<typeof Button>, typeof BUTTON_PROPS[number]>>(function({ wrapper, ...props }, forwarded) {
	
	const ref = useConvergedRef(forwarded);
	const wrapperRef = useConvergedRef(wrapper);

	const [ files, setFiles ] = useState<FileList | undefined>();
	
	useEventMap(ref, {
		change(event) {
			const { files } = event.target as HTMLInputElement;
			if (!files) return;
			setFiles(files);
		}
	});

	useEventMap(wrapperRef, {
		drop(event) {
			event.preventDefault();
			event.stopPropagation();
			if (!event.dataTransfer) return;
			const { files } = event.dataTransfer;
			setFiles(files);
		}
	});

	useEffect(function() {
		if (!files || !ref.current) return;
		const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "files")?.set;
		nativeInputValueSetter?.call(ref.current, files);
		const event = new Event("input", { bubbles: true });
		ref.current.dispatchEvent(event);
	}, [ files, ref ]);

	return (
		<BaseInput
			{ ...props }
			onClick={ () => ref.current?.click() }
			readOnly
			type="text"
			value={ files?.length ? files.length === 1 ? files[0].name : `${ files.length } files` : "" }
			wrapper={ wrapperRef }>
			<Button
				{ ...pick(props, BUTTON_PROPS) }
				className="-mr-1.5"
				onClick={ () => ref.current?.click() }>
				Browse
			</Button>
			<input
				{ ...omit(props, "size") }
				className="hidden"
				ref={ ref }
				type="file" />
		</BaseInput>
	);
});