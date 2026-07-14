import { Bell, Moon, Monitor, Sun, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

function SettingRow({
	label,
	value,
}: {
	label: string;
	value: React.ReactNode;
}) {
	return (
		<div className="flex items-center justify-between gap-4 py-4">
			<p className="text-sm font-medium">{label}</p>
			<div className="text-sm text-muted-foreground">{value}</div>
		</div>
	);
}

export function SettingsPage() {
	return (
		<div className="mx-auto max-w-3xl space-y-6 pb-16 md:pb-0">
			<div>
				<h1 className="text-2xl font-semibold">Settings</h1>
				<p className="text-sm text-muted-foreground">
					Manage preferences, appearance, and notifications.
				</p>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Preferences</CardTitle>
				</CardHeader>
				<CardContent>
					<SettingRow label="Currency" value="AUD (A$)" />
					<Separator />
					<SettingRow label="Default store" value="Coles" />
					<Separator />
					<SettingRow label="Price check frequency" value="Weekly" />
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Appearance</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-3 gap-3">
						<Button className="h-20 flex-col bg-primary/10 text-primary" variant="secondary">
							<Sun className="h-5 w-5" />
							Light
						</Button>
						<Button className="h-20 flex-col" variant="outline">
							<Moon className="h-5 w-5" />
							Dark
						</Button>
						<Button className="h-20 flex-col" variant="outline">
							<Monitor className="h-5 w-5" />
							System
						</Button>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Notifications</CardTitle>
				</CardHeader>
				<CardContent>
					<SettingRow label="In-app alerts" value={<Switch defaultChecked />} />
					<Separator />
					<SettingRow label="Email alerts" value={<Switch defaultChecked />} />
					<Separator />
					<SettingRow label="SMS alerts" value={<Badge variant="secondary">Coming soon</Badge>} />
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Account</CardTitle>
				</CardHeader>
				<CardContent>
					<SettingRow label="Email" value="john.doe@email.com" />
					<Separator />
					<div className="flex flex-col gap-2 py-4">
						<Button className="justify-start text-destructive" variant="ghost">
							<Bell className="h-4 w-4" />
							Log out
						</Button>
						<Button className="justify-start text-destructive" variant="ghost">
							<Trash2 className="h-4 w-4" />
							Delete account
						</Button>
						<p className="mt-4 text-xs text-muted-foreground">Version 1.0.0</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
