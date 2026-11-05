const CELL = 10;
const GAP = 3;
const STEP = CELL + GAP;
const TOP = 16;

const levelOf = (count: number) => {
  if (count === 0) return 0;
  if (count < 4) return 1;
  if (count < 10) return 2;
  if (count < 20) return 3;
  return 4;
};

const monthLabel = new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" });

type Day = { date: string; count: number };

export function ContributionGraph({ days, total }: { days: Day[]; total: number }) {
  const firstWeekday = new Date(days[0].date).getUTCDay();
  const cells = days.map((day, index) => {
    const position = index + firstWeekday;
    return { ...day, week: Math.floor(position / 7), weekday: position % 7 };
  });
  const weeks = cells.at(-1)!.week + 1;

  const months = cells.filter((cell, index) => {
    const startsMonth = cell.date.slice(0, 7) !== cells[index - 1]?.date.slice(0, 7);
    return startsMonth && cell.week > 0 && cell.week < weeks - 2;
  });

  return (
    <div className="overflow-x-auto [direction:rtl]">
      <svg
        role="img"
        aria-label={`${total} GitHub contributions in the last year`}
        viewBox={`0 0 ${weeks * STEP - GAP} ${TOP + 7 * STEP - GAP}`}
        className="h-auto w-full min-w-[560px] [direction:ltr]"
      >
        {months.map((month) => (
          <text key={month.date} x={month.week * STEP} y={9} className="fill-subtle font-mono text-[8px]">
            {monthLabel.format(new Date(month.date))}
          </text>
        ))}
        {cells.map((cell) => (
          <rect
            key={cell.date}
            x={cell.week * STEP}
            y={TOP + cell.weekday * STEP}
            width={CELL}
            height={CELL}
            rx={2}
            fill={`var(--cell-${levelOf(cell.count)})`}
          >
            <title>{`${cell.count} on ${cell.date}`}</title>
          </rect>
        ))}
      </svg>
    </div>
  );
}
