import {
  Flame, Atom, Palette, Landmark, Leaf, Cpu, Sparkles, Users, Briefcase,
} from 'lucide-react';

const map: Record<string, React.ComponentType<{ className?: string }>> = {
  Flame, Atom, Palette, Landmark, Leaf, Cpu, Sparkles, Users, Briefcase,
};

export function CatIcon({ name, className }: { name: string; className?: string }) {
  const C = map[name] ?? Sparkles;
  return <C className={className} />;
}
