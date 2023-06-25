import { Button } from "@nextui/Button";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { Toast } from ".";
import { Dismissible } from "./Dismissible";

export function ToastStack() {
	return (
		<div className="fixed inset-0 z-30 pointer-events-none">
			<div className="absolute bottom-0 right-0 flex flex-col w-full max-w-lg p-4 lg:m-8 xl:m-16 2xl:m-24 2xl:bottom-auto 2xl:top-0 2xl:flex-col-reverse [&>*]:pointer-events-auto overflow-visible">
				
				<Dismissible>
					<Toast icon={IoMdCheckmarkCircleOutline}>
						<div>
							<h1>Toast with title</h1>
							<p>and content...</p>
						</div>
						<Button variant="flat">button</Button>
					</Toast>
				</Dismissible>
				
				<Dismissible>
					<Toast icon={IoMdCheckmarkCircleOutline}>
						<div>
							<h1>Toast with title</h1>
							<p>and content...</p>
						</div>
						<Button variant="flat">button</Button>
					</Toast>
				</Dismissible>
				
				<Dismissible>
					<Toast icon={IoMdCheckmarkCircleOutline}>
						<div>
							<h1>Toast with title</h1>
							<p>and content...</p>
						</div>
						<Button variant="flat">button</Button>
					</Toast>
				</Dismissible>

			</div>
		</div>
	);
}