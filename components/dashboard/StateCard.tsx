"use client";

interface Props {
  title: string;
  value: string | number;
  unit?: string;
}

export default function StateCard({ title, value, unit }: Props) {
  return (
    <div className="p-4 bg-white border rounded-xl dark:bg-zinc-900">
      <p className="text-sm text-muted-foreground">{title}</p>

      <p className="mt-1 text-xl font-semibold">
        {value}
        {unit && (
          <span className="ml-1 text-sm text-muted-foreground">
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}