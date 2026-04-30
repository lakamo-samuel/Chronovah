import { useNavigate } from "react-router-dom";
import { NotebookPen, MapPin, Users, BookOpen, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const TYPE_CONFIG: Record<
  string,
  { icon: React.ElementType; color: string; bg: string; route: string }
> = {
  notes:    { icon: NotebookPen, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-500/10",  route: "/notes" },
  journals: { icon: BookOpen,    color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/10",  route: "/journal" },
  places:   { icon: MapPin,      color: "text-blue-600 dark:text-blue-400",     bg: "bg-blue-500/10",    route: "/places" },
  people:   { icon: Users,       color: "text-green-600 dark:text-green-400",   bg: "bg-green-500/10",   route: "/people" },
};

interface ItemCardProps {
  title: string;
  item: string;
  date: string;
  id: string | number;
}

function ItemCard({ title, item, date, id }: ItemCardProps) {
  const navigate = useNavigate();
  const cfg = TYPE_CONFIG[item] ?? TYPE_CONFIG["notes"];
  const Icon = cfg.icon;

  const destination = `${cfg.route}/${id}`;

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(destination)}
      className="w-full text-left bg-card border border-default rounded-xl p-4 hover:shadow-medium transition-all group cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${cfg.bg}`}>
          <Icon size={15} className={cfg.color} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-primary truncate leading-snug">
            {title || "Untitled"}
          </p>
          <p className="text-xs text-muted mt-1">{formattedDate}</p>
        </div>
        <ArrowRight
          size={14}
          className="flex-shrink-0 text-muted opacity-0 group-hover:opacity-100 transition-opacity mt-0.5"
        />
      </div>
    </motion.button>
  );
}

export default ItemCard;
