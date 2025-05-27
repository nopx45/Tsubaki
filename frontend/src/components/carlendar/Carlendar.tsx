import { useEffect, useState, useMemo, forwardRef } from 'react';
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth,
  isSameMonth, isSameDay, parseISO, addDays, startOfWeek, endOfWeek
} from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { GetEvents, GetProfile } from '../../services/https';
import { EventInterface } from '../../interfaces/IEvent';

interface TUICalendarProps {
  onDateSelect?: (date: Date) => void;
  initialDate?: Date | string;
  className?: string;
  events?: CalendarEvent[];
}

interface CalendarEvent {
  date: Date | string;
  type: 'holiday' | 'training' | string;
  summary?: string;
}

const TUICalendar = forwardRef<HTMLDivElement, TUICalendarProps>(({
  onDateSelect,
  initialDate = new Date(),
  className = '',
  events = []
}, ref) => {
  const navigate = useNavigate();

  const [dbEvents, setDbEvents] = useState<CalendarEvent[]>([]);
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await GetEvents();
        const data = await res.json?.() ?? res.data;

        const parsed = data.map((event: EventInterface) => ({
          date: typeof event.Start === 'string' ? parseISO(event.Start) : event.Start,
          type: event.Type || 'event',
          summary: event.Title || '',
        }));

        setDbEvents(parsed);
      } catch (err) {
        console.error("Failed to load events from database", err);
      }
    };

    const fetchProfile = async () => {
      try {
        const res = await GetProfile();
        const profile = await res.json?.() ?? res;
        setUserRole(profile?.role ?? '');
      } catch (err) {
        console.error("Failed to get user profile:", err);
      }
    };

    fetchProfile();
    fetchEvents();
  }, []);

  const [currentMonth, setCurrentMonth] = useState<Date>(() =>
    typeof initialDate === 'string' ? parseISO(initialDate) : initialDate
  );

  const [selectedDate, setSelectedDate] = useState<Date>(() =>
    typeof initialDate === 'string' ? parseISO(initialDate) : initialDate
  );

  const mergedEvents = useMemo(() => [
    ...(Array.isArray(events) ? events : []),
    ...dbEvents
  ], [events, dbEvents]);

  const parsedEvents = useMemo(() => {
    return mergedEvents.map(event => ({
      date: typeof event.date === 'string' ? parseISO(event.date) : event.date,
      type: event.type,
      summary: event.summary,
    }));
  }, [mergedEvents]);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const onDateClick = (day: Date) => {
    setSelectedDate(day);
    if (onDateSelect) {
      onDateSelect(day);
    }
  };

  const renderHeader = () => (
    <div className="tui-calendar-header">
      <button onClick={prevMonth} className="tui-calendar-nav-button" aria-label="Previous month">
        <svg xmlns="http://www.w3.org/2000/svg" className="tui-calendar-nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h2 className="tui-calendar-title">{format(currentMonth, 'MMMM yyyy')}</h2>
      <button onClick={nextMonth} className="tui-calendar-nav-button" aria-label="Next month">
        <svg xmlns="http://www.w3.org/2000/svg" className="tui-calendar-nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );

  const renderDays = () => {
    const dateFormat = 'EEE';
    const days = [];
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="tui-calendar-day-label" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="tui-calendar-days-grid">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = 'dd';
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSelected = isSameDay(day, selectedDate);
        const isToday = isSameDay(day, new Date());

        const eventForDay = parsedEvents.find(e => isSameDay(e.date, day));
        const isHoliday = ['holiday', 'training', 'meeting', 'other'].includes(eventForDay?.type?.toLowerCase?.() ?? '');

        days.push(
          <div
            className={`tui-calendar-day 
              ${isCurrentMonth ? 'tui-calendar-day-current-month' : 'tui-calendar-day-other-month'} 
              ${isSelected ? 'tui-calendar-day-selected' : ''}
              ${isToday ? 'tui-calendar-day-today' : ''}
              ${isHoliday ? 'tui-calendar-day-holiday' : ''}
            `}
            key={day.toString()}
            onClick={() => onDateClick(cloneDay)}
            title={eventForDay ? `Event: ${eventForDay.summary ?? eventForDay.type}` : ''}
          >
            <span>{formattedDate}</span>
            {isToday && !isSelected && <span className="tui-calendar-day-today-marker"></span>}
          </div>
        );

        day = addDays(day, 1);
      }

      rows.push(
        <div className="tui-calendar-days-grid" key={day.toString()}>
          {days}
        </div>
      );

      days = [];
    }

    return <div className="tui-calendar-days-container">{rows}</div>;
  };

  return (
    <div ref={ref} className={`tui-calendar-container ${className}`}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      <div className="calendar-footer">
        <button 
          onClick={() => onDateClick(new Date())} 
          className="footer-button today-button"
        >
          <svg className="footer-icon" viewBox="0 0 24 24">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
          </svg>
          Today
        </button>
        
        {userRole === 'user' ? (
          <button
            onClick={() => navigate("/calendar")}
            className="footer-button detail-button"
          >
            <svg className="footer-icon" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 12h2v5H7zm4-7h2v12h-2zm4 5h2v7h-2z"/>
            </svg>
            View Details
          </button>
        ) : userRole ? (
          <button
            onClick={() => navigate("/admin/calendar")}
            className="footer-button detail-button"
          >
            <svg className="footer-icon" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 12h2v5H7zm4-7h2v12h-2zm4 5h2v7h-2z"/>
            </svg>
            Manage
          </button>
        ): (
          <button
            onClick={() => navigate("/calendar")}
            className="footer-button detail-button"
          >
            <svg className="footer-icon" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 12h2v5H7zm4-7h2v12h-2zm4 5h2v7h-2z"/>
            </svg>
            View Details
          </button>
        )}
      </div>
      <style>{`
        .tui-calendar-container {
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          width: 95%;
          max-width: 400px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .tui-calendar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .tui-calendar-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e3a8a;
          margin: 0;
        }

        .tui-calendar-nav-button {
          padding: 8px;
          border-radius: 50%;
          background: none;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .tui-calendar-nav-button:hover {
          background-color: #eff6ff;
        }

        .tui-calendar-nav-icon {
          height: 10px;
          color: #2563eb;
        }

        .tui-calendar-days-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          margin-bottom: 8px;
          font-size: 0.6rem;
        }

        .tui-calendar-day-label {
          text-align: center;
          padding: 8px 0;
          color: #2563eb;
          font-weight: 500;
          font-size: 0.675rem;
        }

        .tui-calendar-days-container {
          margin-bottom: 16px;
        }

        .tui-calendar-day {
          position: relative;
          padding: 5px;
          height: 10px;
          border: 1px solid #dbeafe;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tui-calendar-day-current-month {
          color: #1e3a8a;
        }

        .tui-calendar-day-other-month {
          color: #60a5fa;
        }

        .tui-calendar-day:hover {
          background-color: #dbeafe;
        }

        .tui-calendar-day-selected {
          background-color: #2563eb;
          color: white;
          font-weight: bold;
        }

        .tui-calendar-day-today {
          border: 2px solid #60a5fa;
        }

        .tui-calendar-day-today-marker {
          position: absolute;
          bottom: 4px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: #2563eb;
        }

        .tui-calendar-day-holiday {
          background-color:rgb(255, 199, 199);
        }

        .tui-calendar-footer {
          display: flex;
          justify-content: center;
        }

        .tui-calendar-today-button {
          padding: 8px 16px;
          background-color: #dbeafe;
          color: #1e40af;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .tui-calendar-today-button:hover {
          background-color: #bfdbfe;
        }

        .calendar-footer {
          display: flex;
          gap: 12px;
          padding: 12px 0;
          border-top: 1px solid #e0e0e0;
          margin-top: 16px;
        }

        .footer-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 8px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .today-button {
          background-color: #e3f2fd;
          color: #1976d2;
        }

        .today-button:hover {
          background-color: #bbdefb;
          transform: translateY(-1px);
          box-shadow: 0 2px 5px rgba(25, 118, 210, 0.2);
        }

        .detail-button {
          background-color: #1976d2;
          color: white;
        }

        .detail-button:hover {
          background-color: #1565c0;
          transform: translateY(-1px);
          box-shadow: 0 2px 5px rgba(25, 118, 210, 0.3);
        }

        .footer-icon {
          width: 18px;
          height: 18px;
          fill: currentColor;
        }

        .footer-button:active {
          transform: translateY(0);
          box-shadow: none;
        }
      `}</style>
    </div>
  );
});
export default TUICalendar;
