"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Loader2, Moon, Monitor, Sun, Trash2 } from "lucide-react";

import { Notice } from "@/components/feedback/notice";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
	getApiUserSettings,
	getManageInfo,
	putApiUserSettings,
	type InfoResponse,
	type UserSettingsResponse,
} from "@/lib/api/generated/api";
import { apiMutator } from "@/lib/api/mutator";
import { storeNames, stores } from "@/features/products/lib/product-utils";
import { unwrapApiData } from "@/lib/api/response";

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

const priceCheckFrequencies = [
	{ value: "0", label: "Daily" },
	{ value: "1", label: "Weekly" },
	{ value: "2", label: "Fortnightly" },
	{ value: "3", label: "Monthly" },
];

export function SettingsPage() {
	const router = useRouter();
	const [settings, setSettings] = useState<UserSettingsResponse | null>(null);
	const [priceCheckTime, setPriceCheckTime] = useState("09:00");
	const [priceCheckFrequency, setPriceCheckFrequency] = useState("1");
	const [isSavingPriceCheck, setIsSavingPriceCheck] = useState(false);
	const [isSavingSettings, setIsSavingSettings] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const [priceCheckStatus, setPriceCheckStatus] = useState<string | null>(null);
	const [accountEmail, setAccountEmail] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;

		getApiUserSettings()
			.then((response) => {
				if (!isMounted) return;

				const loadedSettings = unwrapSettingsResponse(response);
				setSettings(loadedSettings);
				setPriceCheckTime(toInputTime(loadedSettings.priceCheckTimeOfDay));
				setPriceCheckFrequency(String(loadedSettings.priceCheckFrequency ?? 1));
			})
			.catch(() => {
				if (isMounted) {
					setPriceCheckStatus("Could not load price check settings.");
				}
			});

		getManageInfo()
			.then((response) => {
				if (isMounted) {
					setAccountEmail(unwrapApiData<InfoResponse>(response as unknown as InfoResponse).email);
				}
			})
			.catch(() => {
				if (isMounted) {
					setAccountEmail(null);
				}
			});

		return () => {
			isMounted = false;
		};
	}, []);

	const selectedFrequencyLabel = useMemo(
		() => priceCheckFrequencies.find((frequency) => frequency.value === priceCheckFrequency)?.label ?? "Weekly",
		[priceCheckFrequency],
	);

	async function savePriceCheckSettings() {
		if (!settings) return;

		setIsSavingPriceCheck(true);
		setPriceCheckStatus(null);

		try {
			const updatedSettings = await updateSettings({
				priceCheckFrequency: Number(priceCheckFrequency),
				priceCheckTimeOfDay: priceCheckTime,
				priceCheckTimezone: settings.priceCheckTimezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
			});
			setSettings(updatedSettings);
			setPriceCheckStatus("Saved.");
		} catch {
			setPriceCheckStatus("Could not save price check settings.");
		} finally {
			setIsSavingPriceCheck(false);
		}
	}

	async function updateSettings(updates: Partial<UserSettingsResponse>) {
		if (!settings) throw new Error("Settings have not loaded yet.");

		const nextSettings = { ...settings, ...updates };
		setIsSavingSettings(true);

		try {
			const updatedSettings = unwrapSettingsResponse(
				await putApiUserSettings({
					defaultStore: nextSettings.defaultStore,
					priceCheckFrequency: nextSettings.priceCheckFrequency,
					priceCheckTimeOfDay: nextSettings.priceCheckTimeOfDay,
					priceCheckTimezone: nextSettings.priceCheckTimezone,
					priceCheckDayOfWeek: nextSettings.priceCheckDayOfWeek,
					blockedPriceCheckDays: nextSettings.blockedPriceCheckDays,
					theme: nextSettings.theme,
					emailAlertsEnabled: nextSettings.emailAlertsEnabled,
					smsAlertsEnabled: nextSettings.smsAlertsEnabled,
				}),
			);

			setSettings(updatedSettings);
			return updatedSettings;
		} finally {
			setIsSavingSettings(false);
		}
	}

	async function handleLogout() {
		setIsLoggingOut(true);

		try {
			await apiMutator<void>("/api/auth/logout", {
				method: "POST",
			});
		} finally {
			router.replace("/login");
			router.refresh();
		}
	}

	return (
		<div className="mx-auto max-w-3xl space-y-6 pb-16 md:pb-0">
			<PageHeader
				title="Settings"
				description="Manage preferences, appearance, and notifications."
			/>
			<Card>
				<CardHeader>
					<CardTitle>Preferences</CardTitle>
				</CardHeader>
				<CardContent>
					<SettingRow label="Currency" value="AUD (A$)" />
					<Separator />
					<SettingRow
						label="Default store"
						value={
							<Select
								value={String(settings?.defaultStore ?? stores.Coles)}
								onValueChange={(value) => void updateSettings({ defaultStore: Number(value) })}
								disabled={!settings || isSavingSettings}
							>
								<SelectTrigger className="w-40">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={String(stores.Coles)}>{storeNames[stores.Coles]}</SelectItem>
									<SelectItem value={String(stores.Aldi)}>{storeNames[stores.Aldi]}</SelectItem>
									<SelectItem value={String(stores.Woolworths)}>{storeNames[stores.Woolworths]}</SelectItem>
								</SelectContent>
							</Select>
						}
					/>
					<Separator />
					<div className="space-y-4 py-4">
						<div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
							<div>
								<p className="text-sm font-medium">Price check schedule</p>
								<p className="text-sm text-muted-foreground">
									{selectedFrequencyLabel} at {priceCheckTime}
								</p>
							</div>
							{priceCheckStatus ? (
								<Notice variant={priceCheckStatus === "Saved." ? "success" : "error"} role="status">
									{priceCheckStatus}
								</Notice>
							) : null}
						</div>
						<div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
							<div className="space-y-2">
								<Label htmlFor="price-check-time">Start time</Label>
								<Input
									id="price-check-time"
									type="time"
									value={priceCheckTime}
									onChange={(event) => setPriceCheckTime(event.target.value)}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="price-check-frequency">Frequency</Label>
								<Select value={priceCheckFrequency} onValueChange={setPriceCheckFrequency}>
									<SelectTrigger id="price-check-frequency">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{priceCheckFrequencies.map((frequency) => (
											<SelectItem key={frequency.value} value={frequency.value}>
												{frequency.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<Button type="button" onClick={savePriceCheckSettings} disabled={!settings || isSavingPriceCheck}>
								{isSavingPriceCheck ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
								Save
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Appearance</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-3 gap-3">
						<Button
							className="h-20 flex-col"
							variant={settings?.theme === 0 ? "secondary" : "outline"}
							disabled={!settings || isSavingSettings}
							onClick={() => void updateSettings({ theme: 0 })}
						>
							<Sun className="h-5 w-5" />
							Light
						</Button>
						<Button
							className="h-20 flex-col"
							variant={settings?.theme === 1 ? "secondary" : "outline"}
							disabled={!settings || isSavingSettings}
							onClick={() => void updateSettings({ theme: 1 })}
						>
							<Moon className="h-5 w-5" />
							Dark
						</Button>
						<Button
							className="h-20 flex-col"
							variant={settings?.theme === 2 ? "secondary" : "outline"}
							disabled={!settings || isSavingSettings}
							onClick={() => void updateSettings({ theme: 2 })}
						>
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
					<SettingRow
						label="In-app alerts"
						value={<Switch checked disabled />}
					/>
					<Separator />
					<SettingRow
						label="Email alerts"
						value={
							<Switch
								checked={settings?.emailAlertsEnabled ?? false}
								disabled={!settings || isSavingSettings}
								onCheckedChange={(checked) => void updateSettings({ emailAlertsEnabled: checked })}
							/>
						}
					/>
					<Separator />
					<SettingRow label="SMS alerts" value={<Badge variant="secondary">Coming soon</Badge>} />
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Account</CardTitle>
				</CardHeader>
				<CardContent>
					<SettingRow label="Email" value={accountEmail ?? "Not loaded"} />
					<Separator />
					<div className="flex flex-col gap-2 py-4">
						<Button
							className="justify-start text-destructive"
							variant="ghost"
							type="button"
							disabled={isLoggingOut}
							onClick={handleLogout}
						>
							{isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
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

function unwrapSettingsResponse(response: Awaited<ReturnType<typeof getApiUserSettings | typeof putApiUserSettings>>) {
	if ("data" in response && response.data) {
		return response.data;
	}

	return response as unknown as UserSettingsResponse;
}

function toInputTime(value: string | null) {
	if (!value) return "09:00";

	return value.slice(0, 5);
}
