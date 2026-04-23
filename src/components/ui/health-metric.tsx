import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface HealthMetricProps {
  title: string;
  value: string;
  unit: string;
  status: "normal" | "elevated" | "high";
  timestamp?: string;
  className?: string;
}

export function HealthMetric({ title, value, unit, status, timestamp, className }: HealthMetricProps) {
  const statusConfig = {
    normal: {
      badge: "Normal",
      badgeClass: "bg-secondary text-secondary-foreground",
      cardClass: "border-secondary/30"
    },
    elevated: {
      badge: "Elevated",
      badgeClass: "bg-warning text-warning-foreground",
      cardClass: "border-warning/30"
    },
    high: {
      badge: "High Risk",
      badgeClass: "bg-destructive text-destructive-foreground",
      cardClass: "border-destructive/30"
    }
  };

  const config = statusConfig[status];

  return (
    <Card className={cn("shadow-card bg-gradient-card", config.cardClass, className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <Badge className={config.badgeClass}>{config.badge}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-foreground">{value}</span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
        {timestamp && (
          <p className="text-xs text-muted-foreground mt-2">{timestamp}</p>
        )}
      </CardContent>
    </Card>
  );
}