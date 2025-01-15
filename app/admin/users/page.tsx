import { columns } from "@/components/admin/Columns";
import { DataTable } from "@/components/admin/DataTable";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";

export default async function Users() {
    const data = await db
        .select({
            id: users.id,
            fullName: users.fullName,
            email: users.email,
            universityId: users.universityId,
            role: users.role,
            createdAt: users.createdAt,
            universityCard: users.universityCard,
        })
        .from(users);

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    );
}
