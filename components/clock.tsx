"use client";

import { useEffect, useState } from "react";

const format = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });

export function Clock() {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const update = () => setTime(format.format(new Date()));
    update();
    const timer = setInterval(update, 10_000);
    return () => clearInterval(timer);
  }, []);

  return <span className="tabular-nums">{time} IST</span>;
}
