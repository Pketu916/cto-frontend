import React from "react";

const DEFAULT_STAGES = [
  { key: "pending", label: "Pending" },
  { key: "on_the_way", label: "En Route" },
  { key: "completed", label: "Completed" },
];

const statusKeyToIndex = (stages, statusKey) => {
  const idx = stages.findIndex((s) => s.key === statusKey);
  return idx === -1 ? 0 : idx;
};

const getStageColorClasses = (stageKey, active) => {
  // Use theme: accent (purple) for pending, secondary (orange) for en route, primary (dark blue) for completed
  const map = {
    pending: {
      active: "bg-accent text-white border-accent",
      inactive: "bg-white text-accent border-accent",
      line: "bg-accent",
      indicator: "bg-accent",
    },
    on_the_way: {
      active: "bg-secondary text-primary border-secondary",
      inactive: "bg-white text-secondary border-secondary",
      line: "bg-secondary",
      indicator: "bg-secondary",
    },
    completed: {
      active: "bg-primary text-white border-primary",
      inactive: "bg-white text-primary border-primary",
      line: "bg-primary",
      indicator: "bg-primary",
    },
  };

  const def = map[stageKey] || map.pending;
  return {
    dot: active ? def.active : def.inactive,
    line: def.line,
    indicator: def.indicator,
  };
};

const StatusTracker = ({
  status = "pending",
  stages = DEFAULT_STAGES,
  className = "",
  compact = false,
}) => {
  const activeIndex = statusKeyToIndex(stages, status);

  return (
    <div className={`w-full ${className}`} aria-label="Service status tracker">
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => {
          const isActive = index <= activeIndex;
          const isCurrent = index === activeIndex;
          const { dot, line, indicator } = getStageColorClasses(
            stage.key,
            isActive
          );

          return (
            <div key={stage.key} className="flex items-center flex-1">
              {/* Stage */}
              <div className="flex flex-col items-center flex-1">
                {/* Dot and Connector */}
                <div className="flex items-center w-full">
                  {/* Left connector line */}
                  {index > 0 && (
                    <div
                      className={`h-1 flex-1 ${
                        index <= activeIndex ? line : "bg-gray-200"
                      } transition-colors duration-300`}
                    />
                  )}

                  {/* Status Dot */}
                  <div
                    className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 shrink-0 ${dot} transition-all duration-300 ${
                      isCurrent ? "ring-4 ring-offset-2 scale-110" : ""
                    }`}
                    style={{
                      ...(isCurrent && {
                        boxShadow: `0 0 0 4px ${line}40`,
                      }),
                    }}
                    title={stage.label}
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    <span className="text-xs font-bold">{index + 1}</span>
                    {isCurrent && (
                      <div
                        className="absolute inset-0 rounded-full animate-ping opacity-75"
                        style={{ backgroundColor: line }}
                      />
                    )}
                  </div>

                  {/* Right connector line */}
                  {index < stages.length - 1 && (
                    <div
                      className={`h-1 flex-1 ${
                        index < activeIndex ? line : "bg-gray-200"
                      } transition-colors duration-300`}
                    />
                  )}
                </div>

                {/* Label */}
                {!compact && (
                  <div className="mt-2 text-center relative">
                    <div
                      className={`text-sm font-semibold ${
                        isActive ? "text-primary" : "text-gray-400"
                      } transition-colors`}
                    >
                      {stage.label}
                    </div>
                    {isCurrent && (
                      <div
                        className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 ${indicator} rounded-full animate-pulse`}
                      ></div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusTracker;
