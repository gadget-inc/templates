import { Button } from "@/components/ui/button";

export default function () {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="space-y-6">
          <h1 className="text-6xl font-bold text-foreground">404</h1>
          <h2 className="text-3xl font-semibold text-foreground">Page Not Found</h2>
          <Button asChild>
            <a href="/">Return to Home</a>
          </Button>
        </div>
      </div>
    </div>
  );
}