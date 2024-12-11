"use client";

import React from "react";
import Heading from "@/app/_components/Heading";
import { Card, CardBody, Divider } from "@nextui-org/react";

const timelineEvents = [
  {
    date: "TBD",
    title: "Membership lottery signup opens",
  },
  {
    date: "TBD",
    title: "Lottery is drawn",
  },
  {
    date: "TBD",
    title: "Open sale opens",
  },
  {
    date: "TBD",
    title: "Open sale closes",
  },
  {
    date: "TBD",
    title: "Transfers open",
  },
  {
    date: "TBD",
    title: "Transfers close",
  },
  {
    date: "TBD",
    title: "Burn",
  },
];

export default function TimelinePage() {
  return (
    <div>
      <Heading>Timeline</Heading>

      <div className="space-y-4 mt-6">
        {timelineEvents.map((event, index) => (
          <div key={index} className="relative pl-8">
            {/* Timeline line */}
            {index !== timelineEvents.length - 1 && (
              <div className="absolute left-[0.9375rem] top-11 bottom-[-2rem] w-0.5 bg-gray-200" />
            )}

            {/* Timeline dot */}
            <div className="absolute left-[0.625rem] top-6 w-3 h-3 rounded-full bg-primary-500 border-4 border-white z-10" />

            {/* Timeline event */}
            <Card shadow="sm" className="p-2">
              <CardBody>
                <div>
                  <p className="text-small text-default-500">{event.date}</p>
                  <h3 className="text-lg font-semibold mt-1">{event.title}</h3>
                </div>
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
