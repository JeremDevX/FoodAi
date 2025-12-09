import React from "react";
import { format, parseISO, startOfWeek, addDays, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import type { Prediction } from "../../types";

interface CalendarViewProps {
  predictions: Prediction[];
}

/**
 * Calendar view component for displaying predictions by day
 * Extracted from Predictions.tsx for KISS principle
 */
const CalendarView: React.FC<CalendarViewProps> = ({ predictions }) => {
  const today = new Date();
  const startDate = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const weekDays = Array.from({ length: 7 }).map((_, i) =>
    addDays(startDate, i)
  );

  return (
    <div className="calendar-view">
      <div className="calendar-grid">
        {weekDays.map((date) => {
          const dayPreds = predictions.filter((p) =>
            isSameDay(parseISO(p.predictedDate), date)
          );
          const isToday = isSameDay(date, today);

          return (
            <div
              key={date.toISOString()}
              className={`calendar-day ${isToday ? "today" : ""}`}
            >
              <div className="day-header">
                <span className="day-name">
                  {format(date, "EEEE", { locale: fr })}
                </span>
                <span className="day-number">{format(date, "d")}</span>
              </div>
              <div className="day-content">
                {dayPreds.map((pred) => (
                  <div
                    key={pred.id}
                    className={`cal-event ${
                      pred.confidence > 0.9 ? "urgent" : "moderate"
                    }`}
                  >
                    <span className="cal-prod truncate">
                      {pred.productName}
                    </span>
                    <span className="cal-qty">
                      {pred.recommendation?.quantity}u
                    </span>
                  </div>
                ))}
                {dayPreds.length === 0 && <span className="no-events">-</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
