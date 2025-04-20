import clsx from "clsx";
import { Card, CardContent, CardDescription } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

interface counterBoxProps {
  label: string;
  description?: string;
  numberColor?: string;
  count: number;
  isLoading?: boolean;
}

const CounterBox = ({
  label,
  description,
  count,
  numberColor,
  isLoading = false,
}: counterBoxProps) => {
  return (
    <Card className="flex col-span-1 text-center align">
      <CardContent className="h-full flex flex-col place-content-center gap-2">
        <div className="text-2xl font-bold">{label}</div>
        <CardDescription className="text-center text-xs">
          {description}
        </CardDescription>

        {isLoading ? (
          <Skeleton className="w-24 h-14 mx-auto rounded-md" />
        ) : (
          <div
            className={clsx(
              "text-6xl font-bold",
              numberColor || "text-blue-600"
            )}
          >
            {count}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CounterBox;
