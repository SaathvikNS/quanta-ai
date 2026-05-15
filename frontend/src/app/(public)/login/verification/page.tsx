import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

const Verification = async () => {
	const session = await getServerSession();

	if (session) {
		redirect("/dashboard");
	}

	// 4. Fallback: If no session exists yet, it means they just requested the link
	// and are still sitting on the static "Check your inbox" screen.
	return (
		<div className="bg-background h-dvh w-dvw flex justify-center items-center">
			<div className="bg-muted w-xl h-max rounded-2xl shadow-2xl flex items-center p-10 flex-col">
				<h1 className="text-primary font-extrabold text-3xl">
					Mail Sent
				</h1>
				<p className="text-lg p-5 text-center text-muted-foreground">
					A secure sign-in link has been sent to your email. Please
					click the link in your inbox to access your account.
				</p>
				<div className="bg-gray-700 h-px w-full my-5" />
				<h1 className="font-extrabold text-2xl">
					Quanta<span className="text-primary"> AI</span>
				</h1>
			</div>
		</div>
	);
};

export default Verification;
