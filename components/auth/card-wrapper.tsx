import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Social } from "@/components/auth/social";

export const CardWrapper = () => {
  return (
    <Card className="w-[400px] shadow-md bg-white border-none">
      <CardHeader>
        <div className="w-full flex flex-col gap-y-4 items-center justify-center">
          <p className="text-muted-foreground text-lg">Bem, vindo!</p>
          <h1 className="text-3xl font-semibold">😀</h1>
        </div>
      </CardHeader>
      <CardFooter>
        <Social />
      </CardFooter>
    </Card>
  );
};
