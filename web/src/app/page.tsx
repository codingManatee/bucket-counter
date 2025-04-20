import Controller from "@/components/controller";
import Logger from "@/components/logger";

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 ">
      <Logger />
      <Controller />
    </div>
  );
}
