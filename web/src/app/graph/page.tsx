"use client";

import { Button } from "@/components/ui/button";
import { FrigateEventMessage } from "@prisma/client";
import { useState } from "react";

const Page = () => {
  const [event, setEvent] = useState<FrigateEventMessage[]>();

  const hnadleGet = async () => {
    try {
      const response = await fetch("/api/get-log");
      const data = await response.json();
      if (!response.ok) {
        return;
      }
      setEvent(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Button onClick={hnadleGet}>Get data</Button>
      {event?.map((e) => (
        <div key={e.id} className="">
          {e.eventId}
        </div>
      ))}
    </>
  );
};

export default Page;
