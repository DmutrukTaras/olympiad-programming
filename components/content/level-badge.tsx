import { Badge } from '@/components/ui/badge';
import { levels } from '@/content/levels';
import { cn } from '@/lib/utils';
import type { LevelId } from '@/types/content';

const levelClasses: Record<LevelId, string> = {
  foundation: 'border-level-foundation/25 bg-level-foundation/10 text-level-foundation',
  core: 'border-level-core/25 bg-level-core/10 text-level-core',
  combination: 'border-level-combination/30 bg-level-combination/10 text-level-combination',
  advanced: 'border-level-advanced/25 bg-level-advanced/10 text-level-advanced',
  challenge: 'border-level-challenge/25 bg-level-challenge/10 text-level-challenge',
};

export function LevelBadge({ level, compact = false }: { level: LevelId; compact?: boolean }) {
  const meta = levels[level];

  return (
    <Badge
      variant="outline"
      className={cn('h-6 border font-mono text-[0.68rem] tracking-wide', levelClasses[level])}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {compact ? meta.number : `${meta.number}. ${meta.label}`}
    </Badge>
  );
}
