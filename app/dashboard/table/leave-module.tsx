import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
    group_id: string
}

export default function LeaveModule({ group_id }: Props) {
    const router = useRouter();

    const leaveModule = async () => {
        const supabase = createClient();
        const { error } = await supabase.from("users_groups").delete().eq("group_id", group_id)

        if (error) {
            toast.error("Something went wrong!", { description: error.message });
        } else {
            toast.success("Successfully left the group!");
            router.refresh();
        }
    }

    return <Button className="w-full" onClick={leaveModule} variant="destructive">Leave</Button>
}