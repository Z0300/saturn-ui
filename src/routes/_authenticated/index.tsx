import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/")({
  component: Home,
});

function Home() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <h1 className="text-2xl font-semibold">Welcome to Saturn UI</h1>
      <p className="text-muted-foreground">Select an item from the sidebar to get started.</p>
    </div>
  );
}

