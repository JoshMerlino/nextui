import { cva, type VariantProps } from "class-variance-authority";
import { merge } from "lodash";
import { cn } from "nextui/util";
import { use, type HTMLAttributes, type ReactNode } from "react";
import { Container } from "./Container";
import { ToolbarShellContext } from "./ToolbarShell";

export const classes = {
	toolbar: cva("min-h-16 not-motion-reduce:transition-[box-shadow,border-color] border-b", {
		variants: {
			raised: {
				true: "shadow-md border-transparent dark:shadow-black/30",
				false: "border-gray-200 dark:border-gray-800"
			},
			variant: {
				glass: "backdrop-blur-2xl bg-gray-100/60 dark:bg-gray-900/60"
			}
		},
		defaultVariants: {
			variant: "glass"
		}
	})
};

export function Toolbar({ children, className, contained = true, icon, raised: isRaised, ...props }: HTMLAttributes<HTMLElement> & VariantProps<typeof classes.toolbar> & Partial<{

	/**
	 * Whether the toolbar has a shadow.
	 * The raised value can also be controlled by the ToolbarShell component.
	 * @default false
	 */
	raised: boolean;

	/**
	 * The variant of the toolbar.
	 * @default glass
	 */
	variant: "glass";

	/**
	 * Whether the toolbar is contained within a container.
	 * @default true
	 */
	contained: boolean;

	/**
	 * The primary icon to display on the toolbar.
	 */
	icon: ReactNode;

}>) {
	const raised = isRaised || use(ToolbarShellContext);
	return (
		<header
			{ ...props }
			className={ cn(classes.toolbar(merge(props, { raised }) as VariantProps<typeof classes.toolbar>), className) }>
			
			<div className="flex items-center mx-4 gap-4 h-16">
				{ icon }
				<Container className={ cn(contained || "max-w-full") }>
					{ children }
				</Container>
			</div>
		</header>
	);
}

