import { Bell } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AlertsPage() {
	return (
		<div className="mx-auto max-w-3xl space-y-6 pb-16 md:pb-0">
			<div>
				<h1 className="text-2xl font-semibold">Alerts</h1>
				<p className="text-sm text-muted-foreground">
					Price alerts and notification history will appear here.
				</p>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Recent alerts</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex min-h-56 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
						<Bell className="h-8 w-8" />
						<p>No alerts yet.</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
