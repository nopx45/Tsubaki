import React, { useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiPlus, FiClock, FiCalendar, FiInfo } from 'react-icons/fi';
import { FaUmbrellaBeach, FaTree, FaGift, FaSnowflake, FaFire } from 'react-icons/fa';
import dayjs from 'dayjs';
import { GetEvents } from '../../../services/https';
import { EventInterface } from '../../../interfaces/IEvent';

type Event = {
  id: string;
  time: string;
  title: string;
  type: string;
  day: number;
  month: number;
  year: number;
  description: string;
};

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipEvent, setTooltipEvent] = useState<Event | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await GetEvents();
        const data = await res.json?.() ?? res.data;
  
        const mapped = data.map((event: EventInterface) => {
          const d = dayjs(event.Start);
          return {
            id: String(event.ID),
            time: d.format('HH:mm'),
            title: event.Title,
            type: event.Type as Event['type'],
            day: d.date(),
            month: d.month(),
            year: d.year(),
            description: event.Description ?? '',
          };
        });
  
        setEvents(mapped);
      } catch (err) {
        console.error("Error fetching events", err);
      }
    };
  
    fetchEvents();
  }, []);
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderEventIcon = (type: string) => {
    switch(type) {
      case 'holiday': return <FaUmbrellaBeach className="icon" />;
      case 'event': return <FaFire className="icon" />;
      case 'meeting': return <FaGift className="icon" />;
      case 'birthday': return <FaTree className="icon" />;
      case 'reminder': return <FaSnowflake className="icon" />;
      default: return <FaUmbrellaBeach className="icon" />;
    }
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const prevMonthDays = getDaysInMonth(year, month - 1);

    const calendarDays = [];
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      calendarDays.push(
        <div key={`prev-${day}`} className="calendar-day other-month">
          {day}
        </div>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = events.filter(
        e => e.day === day && e.month === month && e.year === year
      );
      
      const isToday = new Date().getDate() === day && 
                      new Date().getMonth() === month && 
                      new Date().getFullYear() === year;
      
      calendarDays.push(
        <div 
          key={`current-${day}`} 
          className={`calendar-day ${isToday ? 'today' : ''}`}
        >
          <div className="day-number">{day}</div>
          {dayEvents.map(event => (
            <div 
              key={event.id} 
              className={`event ${event.type}`}
              onClick={(e) => {
                e.stopPropagation();
                handleEventClick(event, e);
              }}
            >
              <div className="event-time">
                <FiClock size={12} /> {event.time}
              </div>
              <div className="event-title">
                {renderEventIcon(event.type)} {event.title}
              </div>
            </div>
          ))}
          {dayEvents.length === 0 && (
            <div className="add-event-placeholder" onClick={(e) => {
              e.stopPropagation();
            }}>
              <FiPlus size={16} />
            </div>
          )}
        </div>
      );
    }

    // Next month days
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const remainingDays = totalCells - (firstDay + daysInMonth);
    
    for (let day = 1; day <= remainingDays; day++) {
      calendarDays.push(
        <div key={`next-${day}`} className="calendar-day other-month">
          {day}
        </div>
      );
    }

    return calendarDays;
  };

  const handleEventClick = (event: Event, e: React.MouseEvent) => {
    setTooltipEvent(event);
    setTooltipPosition({ x: e.clientX, y: e.clientY });
    setShowTooltip(true);
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      setShowTooltip(false);
    }, 5000);
  };

  const changeMonth = (increment: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + increment);
      return newDate;
    });
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="nav-button" onClick={() => changeMonth(-1)}>
          <FiChevronLeft size={20} />
        </button>
        <h2>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
        <button className="nav-button" onClick={() => changeMonth(1)}>
          <FiChevronRight size={20} />
        </button>
      </div>
      
      <div className="calendar-grid">
        {daysOfWeek.map(day => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}
        {renderCalendar()}
      </div>

      {showTooltip && tooltipEvent && (
        <div 
          className="event-tooltip"
          style={{
            left: `${Math.min(tooltipPosition.x + 10, window.innerWidth - 320)}px`,
            top: `${Math.min(tooltipPosition.y + 10, window.innerHeight - 280)}px`
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="tooltip-header">
            {renderEventIcon(tooltipEvent.type)}
            <h4>{tooltipEvent.title}</h4>
            <span className="event-type-badge">{tooltipEvent.type}</span>
          </div>
          
          <div className="tooltip-detail">
            <FiCalendar className="detail-icon" />
            <span>{dayjs(`${tooltipEvent.year}-${tooltipEvent.month + 1}-${tooltipEvent.day}`).format('dddd, MMMM D, YYYY')}</span>
          </div>
          
          <div className="tooltip-detail">
            <FiClock className="detail-icon" />
            <span>{tooltipEvent.time}</span>
          </div>
          
          <div className="tooltip-detail">
            <FiInfo className="detail-icon" />
            <span>{tooltipEvent.description || 'No description'}</span>
          </div>
        </div>
      )}
      <style>{`
        /* Modern Blue-Green-Purple Theme Calendar */
        .calendar-container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          max-width: 90%;
          margin: 20px auto;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          background: white;
        }

        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: linear-gradient(135deg, #1976d2, #00acc1);
          color: white;
          border-radius: 12px 12px 0 0;
        }

        .calendar-header h2 {
          margin: 0;
          font-weight: 500;
          font-size: 1.5rem;
        }

        .nav-button {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-button:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 1px;
          overflow-x: auto;
          background: #e0e0e0;
        }

        .calendar-day-header {
          padding: 15px 10px;
          text-align: center;
          font-weight: 600;
          background: #f5f9ff;
          color: #1976d2;
          text-transform: uppercase;
          font-size: 0.8rem;
        }

        .calendar-day {
          min-height: 120px;
          padding: 8px;
          background: white;
          position: relative;
          transition: all 0.2s;
        }

        .calendar-day:hover {
          background: #f5f9ff;
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
        }

        .calendar-day.today {
          background: #e3f2fd;
        }

        .calendar-day.today .day-number {
          background: #1976d2;
          color: white;
        }

        .day-number {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-weight: 500;
          margin-bottom: 5px;
        }

        .other-month {
          background: #f9f9f9;
          color: #aaa;
        }

        .event {
          font-size: 0.75rem;
          padding: 6px;
          margin: 4px 0;
          border-radius: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          cursor: pointer;
          transition: all 0.2s;
          border-left: 3px solid;
        }

        .event:hover {
          transform: translateX(2px);
        }

        .event-time {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          opacity: 0.8;
        }

        .event-title {
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 500;
        }

        .icon {
          flex-shrink: 0;
        }

        /* Event Type Styles */
        .holiday {
          background: #ffebee;
          color: #c62828;
          border-left-color: #b71c1c;
        }

        .event {
          background:rgb(249, 206, 202);
          color:rgb(46, 60, 125);
          border-left-color:rgb(179, 21, 21);
        }

        .meeting {
          background: #e3f2fd;
          color: #1565c0;
          border-left-color: #0d47a1;
        }

        .birthday {
          background: #f3e5f5;
          color: #8e24aa;
          border-left-color: #6a1b9a;
        }

        .reminder {
          background: #e0f7fa;
          color: #00838f;
          border-left-color: #006064;
        }

        .add-event-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1976d2;
          opacity: 0;
          transition: all 0.2s;
          cursor: pointer;
          margin-top: 4px;
        }

        .calendar-day:hover .add-event-placeholder {
          opacity: 0.7;
        }

        .add-event-placeholder:hover {
          opacity: 1 !important;
        }

        /* Tooltip Styles */
        .event-tooltip {
          position: fixed;
          z-index: 1000;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          max-width: 300px;
          animation: fadeIn 0.2s ease-in-out;
        }

        .event-tooltip h4 {
          margin: 0 0 8px 0;
          color: #1976d2;
          font-size: 1.1rem;
        }

        .event-tooltip p {
          margin: 4px 0;
          font-size: 0.9rem;
          color: #555;
        }

        .event-tooltip strong {
          color: #333;
        }

        .edit-button {
          margin-top: 8px;
          padding: 6px 12px;
          background: #1976d2;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 0.8rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .edit-button:hover {
          background: #1565c0;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .event-tooltip {
          position: fixed;
          z-index: 1000;
          background: white;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 8px 24px rgba(25, 118, 210, 0.2);
          width: 300px;
          animation: fadeIn 0.2s ease-out;
          border: 1px solid #e3f2fd;
          backdrop-filter: blur(4px);
        }

        .tooltip-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e3f2fd;
        }

        .tooltip-header h4 {
          margin: 0;
          font-size: 1.1rem;
          color: #1565c0;
          flex-grow: 1;
        }

        .tooltip-header .icon {
          color: #1976d2;
          font-size: 1.2rem;
        }

        .event-type-badge {
          background: #ff9800;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.7rem;
          text-transform: capitalize;
        }

        .tooltip-detail {
          display: flex;
          gap: 10px;
          margin-bottom: 12px;
          align-items: flex-start;
        }

        .tooltip-detail .detail-icon {
          color: #1976d2;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .tooltip-detail span {
          color: #455a64;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .tooltip-actions {
          margin-top: 16px;
          display: flex;
          justify-content: flex-end;
        }

        .edit-button {
          background: linear-gradient(135deg, #1976d2, #2196f3);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .edit-button:hover {
          background: linear-gradient(135deg, #1565c0, #1976d2);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
        }

        @keyframes fadeIn {
          from { 
            opacity: 0;
            transform: translateY(5px) scale(0.98);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Modal Styles */
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          backdrop-filter: blur(3px);
        }

        .modal-content {
          background-color: white;
          padding: 25px;
          border-radius: 12px;
          width: 400px;
          max-width: 90%;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          position: relative;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .modal-header h3 {
          margin: 0;
          color: #1976d2;
          font-weight: 600;
        }

        .close-button {
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          padding: 5px;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .close-button:hover {
          background: #f5f5f5;
          color: #333;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          font-weight: 500;
          color: #555;
        }

        .input-icon {
          color: #1976d2;
        }

        .form-group input, .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .form-group textarea {
          resize: vertical;
        }

        .form-group input:focus, .form-group textarea:focus {
          outline: none;
          border-color: #1976d2;
          box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
        }

        .icon-selector {
          display: flex;
          gap: 10px;
          margin-top: 10px;
          flex-wrap: wrap;
        }

        .icon-option {
          background: none;
          border: 2px solid #e0e0e0;
          padding: 8px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.2s;
          color: #555;
          flex: 1;
          min-width: 80px;
          justify-content: center;
        }

        .icon-option span {
          font-size: 0.8rem;
        }

        .icon-option:hover {
          border-color: #1976d2;
          color: #1976d2;
        }

        .icon-option.active {
          border-color: #1976d2;
          background: #e3f2fd;
          color: #1976d2;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }

        .modal-actions button {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .delete-button {
          background: #ffebee;
          color: #d32f2f;
        }

        .delete-button:hover {
          background: #ffcdd2;
        }

        .save-button {
          background: #1976d2;
          color: white;
        }

        .save-button:hover {
          background: #1565c0;
        }
      `}</style>
    </div>
  );
};

export default Calendar;