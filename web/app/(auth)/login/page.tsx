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

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
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
			setError("Could not sign in with those details.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<main className="flex min-h-screen items-center justify-center bg-background px-6 py-10">
			<Card className="w-full max-w-md">
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
								required
							/>
						</div>
						{error ? (
							<p className="text-sm text-destructive" role="alert">
								{error}
							</p>
						) : null}
						<Button className="w-full" type="submit" disabled={isSubmitting}>
							{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
							Sign in
						</Button>
					</form>
					<p className="mt-6 text-center text-sm text-muted-foreground">
						New here?{" "}
						<Link className="font-medium text-primary hover:underline" href="/register">
							Create an account
						</Link>
					</p>
				</CardContent>
			</Card>
		</main>
	);
}
