"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Loader2 } from "lucide-react";

import { postLogin } from "@/lib/api/generated/api";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthBrand } from "@/features/auth/components/auth-brand";

export function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [formError, setFormError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setFormError(null);

		if (!email.trim()) {
			setFormError("Enter your email address.");
			return;
		}

		if (!email.includes("@")) {
			setFormError("Enter a valid email address.");
			return;
		}

		if (!password) {
			setFormError("Enter your password.");
			return;
		}

		setIsSubmitting(true);

		try {
			await postLogin(
				{
					email,
					password,
				},
				{
					useCookies: true,
					useSessionCookies: true,
				},
			);

			router.push("/catalog");
		} catch {
			setFormError("Could not sign in with those details.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<main className="flex min-h-screen items-center justify-center bg-background px-6 py-8">
			<div className="flex w-full max-w-md -translate-y-6 flex-col items-center gap-4">
				<AuthBrand />
				<Card className="w-full">
					<CardHeader>
						<CardTitle>Sign in</CardTitle>
						<CardDescription>
							Use your account to track prices and manage watchlists.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form className="space-y-5" onSubmit={handleSubmit}>
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									autoComplete="email"
									value={email}
									onChange={(event) => setEmail(event.target.value)}
									aria-invalid={Boolean(formError)}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									autoComplete="current-password"
									value={password}
									onChange={(event) => setPassword(event.target.value)}
									aria-invalid={Boolean(formError)}
									required
								/>
							</div>
							{formError ? (
								<p className="text-sm text-destructive" role="alert">
									{formError}
								</p>
							) : null}
							<Button className="w-full" type="submit" disabled={isSubmitting}>
								{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
								Sign in
							</Button>
						</form>
						<p className="mt-6 text-center text-sm text-muted-foreground">
							New here?{" "}
							<Link
								className="cursor-pointer font-medium text-primary hover:underline"
								href="/register"
							>
								Create an account
							</Link>
						</p>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
