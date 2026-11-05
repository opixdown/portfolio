"use client";

import { useEffect, useRef, useState } from "react";
import demo from "@/data/compiler-demo.json";

export function CompilerDemo() {
  const [active, setActive] = useState(0);
  const [reached, setReached] = useState(0);
  const panel = useRef<HTMLDivElement>(null);
  const stage = demo.stages[active];
  const total = demo.stages.length;

  useEffect(() => {
    const scroller = panel.current;
    const marked = scroller?.querySelector<HTMLElement>("mark");
    if (!scroller || !marked) return;
    const top = marked.offsetTop - scroller.clientHeight / 2 + marked.offsetHeight / 2;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scroller.scrollTo({ top: Math.max(top, 0), behavior: reduceMotion ? "auto" : "smooth" });
  }, [active]);

  function handleNext() {
    if (active === total - 1) {
      setActive(0);
      setReached(0);
      return;
    }
    setActive(active + 1);
    setReached(Math.max(reached, active + 1));
  }

  const markStart = stage.text.indexOf(stage.mark);
  const before = stage.text.slice(0, markStart);
  const after = stage.text.slice(markStart + stage.mark.length);

  return (
    <div className="overflow-hidden rounded-lg border border-line">
      <div className="border-b border-line px-3 py-2">
        <div role="tablist" aria-label="Compiler steps" className="flex w-full min-w-0 items-center overflow-x-auto font-mono text-xs">
          {demo.stages.map((item, index) => (
            <span key={item.id} className="flex shrink-0 items-center">
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className={`px-0.5 transition-colors duration-200 ${index <= reached ? "text-fg" : "text-line-strong"}`}
                >
                  →
                </span>
              )}
              <button
                type="button"
                role="tab"
                aria-selected={index === active}
                disabled={index > reached}
                onClick={() => setActive(index)}
                className={`min-h-9 rounded px-1.5 transition-colors duration-150 sm:px-2 ${
                  index === active
                    ? "cursor-pointer bg-surface text-fg"
                    : index <= reached
                      ? "cursor-pointer text-muted hover:text-fg"
                      : "cursor-default text-subtle"
                }`}
              >
                {item.label}
              </button>
            </span>
          ))}
        </div>
      </div>

      <div ref={panel} tabIndex={0} aria-label={`${stage.label} output`} className="relative h-64 overflow-auto bg-surface/40 p-4">
        <pre key={stage.id} className="stage-in w-max font-mono text-xs leading-5 text-muted">
          {before}
          <mark className="rounded-sm bg-fg px-0.5 text-bg">{stage.mark}</mark>
          {after}
        </pre>
      </div>

      <div className="border-t border-line p-4">
        <p aria-live="polite" className="text-sm leading-relaxed text-prose">
          {stage.note}
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[11px] text-subtle">
            Step {active + 1} of {total} · real output · lfortran {stage.file}
          </p>
          <button
            type="button"
            onClick={handleNext}
            className="min-h-11 w-full cursor-pointer rounded-md bg-fg px-4 text-sm font-medium text-bg transition-opacity duration-150 hover:opacity-85 sm:w-auto"
          >
            {stage.next}
            {active < total - 1 ? " →" : ""}
          </button>
        </div>
      </div>
    </div>
  );
}
