import { Card } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  detail,
  positive,
}: {
  label: string;
  value: string;
  detail: string;
  positive?: boolean;
}) {
  return (
    <Card className="p-5">
      <p className="text-muted text-sm">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
      <p className={positive ? "text-accent mt-2 text-xs" : "text-muted mt-2 text-xs"}>{detail}</p>
    </Card>
  );
}
