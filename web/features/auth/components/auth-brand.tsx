import Image from "next/image";

export function AuthBrand() {
	return (
		<div className="flex justify-center">
			<Image
				src="/wac-logo.png"
				alt="WAC Price Watch"
				width={176}
				height={176}
				priority
			/>
		</div>
	);
}
