import { forwardRef } from "react";

import BaseInput from "./BaseInput";
import DateInput from "./DateInput";
import PasswordInput from "./PasswordInput";

type InputFieldTypes = {
    text: ExtractProps<typeof BaseInput>;
    password: ExtractProps<typeof PasswordInput>;
    date: ExtractProps<typeof DateInput>;
};

type InputFactoryProps<T extends keyof InputFieldTypes> = { type: T } & InputFieldTypes[T];

export const InputField = forwardRef<HTMLInputElement, InputFactoryProps<keyof InputFieldTypes>>(function(props, ref) {
	switch (props.type) {
		default: return <BaseInput { ...props } ref={ ref } />;
		case "date": return <DateInput { ...props } ref={ ref } />;
		case "password": return <PasswordInput { ...props } ref={ ref } />;
	}
});