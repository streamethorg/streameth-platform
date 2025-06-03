import { StudioPageParams } from "@/lib/types";
import {
	Card,
	CardTitle,
	CardDescription,
	CardHeader,
	CardContent,
} from "@/components/ui/card";
import { fetchOrganizationMembers } from "@/lib/services/organizationService";
import DeleteTeamMember from "./components/DeleteTeamMember";
import {
	Table,
	TableHead,
	TableHeader,
	TableRow,
	TableBody,
	TableCell,
} from "@/components/ui/table";
import InviteCode from "./components/InviteCode";

const Settings = async ({ params }: { params: StudioPageParams["params"] }) => {
	const { organization } = await params;

	const members = await fetchOrganizationMembers({
		organizationId: organization,
	});

	return (
		<>
			<div className="flex p-4 w-full max-w-4xl max-h-full">
				<Card className="flex flex-col w-full h-full bg-white rounded-r-xl border shadow-none md:p-0">
					<CardHeader>
						<div className="flex flex-row justify-between items-center">
							<div>
								<CardTitle>Team members</CardTitle>
								<CardDescription className="mt-2">
									Invite your team members to collaborate.
								</CardDescription>
							</div>
							<InviteCode />
						</div>
					</CardHeader>
					<CardContent className="overflow-auto flex-1 p-6 md:p-6 lg:p-6">
						<div className="overflow-auto mt-6 h-full">
							<Table className="w-full">
								<TableHeader className="sticky top-0 z-10 bg-gray-100 border-separate">
									<TableRow className="border-b hover:bg-whiterounded-t-xl">
										<TableHead>Email</TableHead>
										<TableHead>Role</TableHead>
										<TableHead>Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{members?.map(({ _id, email, role }) => (
										<TableRow key={_id}>
											<TableCell>{email}</TableCell>
											<TableCell>{role}</TableCell>
											<TableCell>
												<DeleteTeamMember memberEmail={email as string} />
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card>
			</div>
		</>
	);
};

export default Settings;
