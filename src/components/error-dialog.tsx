import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { TriangleAlert } from "lucide-react"

interface ErrorDialogProps {
    open: boolean
    onClose: () => void
    title?: string
    message: string
}

export function ErrorDialog({
    open,
    onClose,
    title = "Something went wrong",
    message,
}: ErrorDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={() => { }}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                            <TriangleAlert className="h-5 w-5 text-destructive" />
                        </div>
                        <AlertDialogTitle className="text-destructive">
                            {title}
                        </AlertDialogTitle>
                    </div>

                    <AlertDialogDescription className="mt-2 pl-13">
                        {message}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={onClose}
                    >
                        OK
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}