import Controller from "@/components/controller";
import Logger from "@/components/logger";

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 max-h-full overflow-auto">
      {/* <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  router.push("/history");
                }}
              >
                <ScrollText className="h-4 w-4 mr-1" />
                View Details History
              </Button> */}
      <Logger />
      <Controller />
    </div>
  );
}
