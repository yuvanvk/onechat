import { cn } from "@/utils/cn";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/card";

export const Auth = () => {
  return (
    <div
      className={cn("flex flex-col items-center justify-center min-h-screen")}
    >
      <h1 className="text-4xl font-semibold font-sans tracking-tighter">
        Welcome to Strato AI
      </h1>
      <Card className=" max-w-md w-full p-3 rounded-2xl my-2">
        <CardContent>
          <span>hi</span>
        </CardContent>
      </Card>
    </div>
  );
};
