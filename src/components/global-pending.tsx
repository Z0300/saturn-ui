import { Loader2 } from "lucide-react";

const GlobalPending = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
    );
};

export default GlobalPending;