import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// rows = [[label, count, 'tailwind-bg-class'], ...]
export default function StatusBars({ title, rows }) {
  const max = Math.max(1, ...rows.map((r) => r[1]));
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.map(([label, count, color]) => (
          <div key={label} className="flex items-center gap-3 text-sm">
            <span className="w-20 capitalize">{label}</span>
            <div className="h-5 flex-1 rounded bg-gray-100">
              <div className={`h-5 rounded ${color}`} style={{ width: `${(count / max) * 100}%` }} />
            </div>
            <span className="w-8 text-right font-semibold">{count}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}