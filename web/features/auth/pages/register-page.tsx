"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

import { postRegister } from "@/lib/api/generated/api";
import { Button, buttonVariants } from "@/components/ui/button";
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

export function RegisterPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [formError, setFormError] = useState<string | null>(null);
	const [isComplete, setIsComplete] = useState(false);
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

		if (password.length < 6) {
			setFormError("Password must be at least 6 characters.");
			return;
		}

		if (password !== confirmPassword) {
			setFormError("Passwords do not match.");
			return;
		}

		setIsSubmitting(true);

		try {
			await postRegister({
				email,
				password,
			});

			setIsComplete(true);
		} catch {
			setFormError("Could not create an account with those details.");
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
						<CardTitle>Create account</CardTitle>
						<CardDescription>
							Start tracking your grocery prices across stores.
						</CardDescription>
					</CardHeader>
					<CardContent>
						{isComplete ? (
							<div className="space-y-5">
								<div className="flex items-center gap-3 rounded-md border border-border bg-secondary px-4 py-3 text-sm text-secondary-foreground">
									<CheckCircle2 className="h-5 w-5 text-primary" />
									Account created. You can sign in now.
								</div>
								<Link className={buttonVariants({ className: "w-full" })} href="/login">
									Go to sign in
								</Link>
							</div>
						) : (
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
										autoComplete="new-password"
										minLength={6}
										value={password}
										onChange={(event) => setPassword(event.target.value)}
										aria-invalid={Boolean(formError)}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="confirm-password">Confirm password</Label>
									<Input
										id="confirm-password"
										type="password"
										autoComplete="new-password"
										minLength={6}
										value={confirmPassword}
										onChange={(event) => setConfirmPassword(event.target.value)}
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
									Create account
								</Button>
							</form>
						)}
						<p className="mt-6 text-center text-sm text-muted-foreground">
							Already have an account?{" "}
							<Link
								className="cursor-pointer font-medium text-primary hover:underline"
								href="/login"
							>
								Sign in
							</Link>
						</p>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
