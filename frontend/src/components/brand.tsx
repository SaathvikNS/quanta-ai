// import Image from "next/image";
import Link from "next/link";
import Logo from "./Logo";

export function Brand({ className = "" }: { className?: string }) {
	return (
		<Link href={"/"} className={`flex items-center gap-2 ${className}`}>
			<div className="relative h-7 w-7">
				{/* <div className="absolute inset-0 rounded-md bg-linear-to-br from-primary to-info opacity-90" />
				<div className="absolute inset-0.75 rounded-[5px] bg-background flex items-center justify-center">
					<span className="font-mono text-[10px] font-bold tracking-tighter">
						Q
					</span>
				</div> */}
				<Logo />

				{/* <Image
					src={"/favicon.ico"}
					alt="brand-logo"
					width={500}
					height={500}
				/> */}
			</div>
			<div className="flex flex-col leading-none">
				<span className="text-sm font-semibold tracking-tight">
					QUANTA
				</span>
				<span className="font-mono text-[9px] uppercase tracking-widest text-green">
					Intelligence
				</span>
			</div>
		</Link>
	);
}
