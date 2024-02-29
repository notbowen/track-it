import { Button } from "@/components/ui/button";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
    group_id: string,
}

export default function ModuleDeleter({ group_id }: Props) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const delete_module = async () => {
        const supabase = createClient();
        const { data } = await supabase.from("groups").delete().eq("id", group_id).select();

        // For some reason no errors are returned even when DELETE RLS policies are in place
        // Hence we check if the returned rows are > 0, indicating a successful deletion
        // See: https://github.com/supabase/postgrest-js/issues/307
        if (data && data?.length === 0) {
            toast.error("You are not allowed to delete this module!", {
                description: "Only the creator of this module can delete it.",
            })
        } else {
            toast.success("Module has been deleted!")
            router.refresh()
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button className="w-full" variant="secondary"><ExclamationTriangleIcon
                    className="mr-2"/> Delete Group</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        module from our database forever.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={delete_module}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}