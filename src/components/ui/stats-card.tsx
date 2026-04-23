import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  variant?: "default" | "warning" | "critical";
  className?: string;
}

export function StatsCard({ title, value, description, variant = "default", className }: StatsCardProps) {
  const variantClasses = {
    default: "border-primary/20 bg-gradient-card",
    warning: "border-warning/30 bg-gradient-to-br from-warning/5 to-warning/10",
    critical: "border-destructive/30 bg-gradient-to-br from-destructive/5 to-destructive/10"
  };

  return (
    <Card className={cn("shadow-card", variantClasses[variant], className)}>
      <CardContent className="p-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}