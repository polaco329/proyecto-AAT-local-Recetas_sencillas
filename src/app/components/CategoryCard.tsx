import { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
}

export function CategoryCard({ name, icon: Icon, color, onClick }: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-3 p-6 rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
    >
      <div className={`${color} p-4 rounded-full group-hover:rotate-12 transition-transform duration-300`}>
        <Icon className="w-8 h-8 text-green-700" />
      </div>
      <span className="font-semibold text-gray-800">{name}</span>
    </button>
  );
}
