import { getTrades, type Print } from "@/lib/trades";
import { useEffect, useState } from "react";

export function usePrints() {
  const [rows, setRows] = useState<Print[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let stop = false;
    const load = () => {
      getTrades()
        .then((next) => {
          if (!stop) {
            setRows(next);
            setErr(null);
          }
        })
        .catch((e) => {
          if (!stop) setErr(e instanceof Error ? e.message : "tape down");
        });
    };
    load();
    const id = setInterval(load, 12000);
    return () => {
      stop = true;
      clearInterval(id);
    };
  }, []);

  return { rows, err };
}
