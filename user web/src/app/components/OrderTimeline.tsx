import { motion } from "motion/react";
import type { TrackingStatus } from "../../lib/types";

export function OrderTimeline({ statuses }: { statuses: TrackingStatus[] }) {
  const currentStatusIndex = statuses.reduce((lastIndex, status, index) => status.completed ? index : lastIndex, -1);

  return (
    <div className="relative">
      <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200" />
      {statuses.map((statusItem, index) => {
        const Icon = statusItem.icon;
        const isActive = statusItem.completed;
        const isCurrent = index === currentStatusIndex;

        return (
          <motion.div key={statusItem.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="relative flex items-start gap-4 pb-8 last:pb-0">
            <motion.div
              animate={isCurrent ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${isActive ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg" : "bg-gray-200 text-gray-400"}`}
            >
              <Icon className="w-6 h-6" />
            </motion.div>
            <div className="flex-1 pt-2">
              <p className={`font-semibold ${isActive ? "text-gray-900" : "text-gray-400"}`}>{statusItem.label}</p>
              {statusItem.date && <p className="text-sm text-gray-500 mt-1">{statusItem.date}</p>}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
