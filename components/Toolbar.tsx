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
	const raised = isRaised ?? use(ToolbarShellContext);
	return (
		<header
			{ ...props }
			className={ cn(classes.toolbar(merge(props, { raised }) as VariantProps<typeof classes.toolbar>), className) }>
			
			{ /* The drawer button belongs to the toolbar, not to the row inside
			     it, so the row cannot hide it when the mobile search takes over.
			     Matched as `> button` rather than `> *:first-child` because the
			     icon is optional and the Container would be first without it. */ }
			<div className="flex items-center mx-4 gap-4 h-16 [&>button]:transition-[opacity,visibility] [&>button]:duration-200 motion-reduce:[&>button]:transition-none has-[[data-search-expanded]]:[&>button]:opacity-0 has-[[data-search-expanded]]:[&>button]:invisible">
				{ icon }

				{ /* `min-w-0` is load-bearing. Container is `w-full`, so as a flex
				     item it takes 100% of this row and then sits AFTER the icon,
				     overflowing by the icon's width plus the gap. Nothing inside
				     can correct for it: the row's own children shrink fine, the
				     box holding them is simply wider than the space left. Below
				     `md` that overflow is one icon button, which is why the last
				     control in every toolbar ran off the right edge on a phone. */ }
				<Container className={ cn("min-w-0", contained || "max-w-full") }>
					{ children }
				</Container>
			</div>
		</header>
	);
}

