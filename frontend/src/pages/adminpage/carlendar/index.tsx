import React, { useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiPlus, FiX, FiClock, FiEdit2, FiTrash2, FiSave } from 'react-icons/fi';
import { CreateEvents, DeleteEvents, GetEvents, UpdateEvents, UploadICS } from '../../../services/https';
import dayjs from 'dayjs';
import { EventInterface } from '../../../interfaces/IEvent';
import { message } from 'antd';

type Event = {
  id: string;
  time: string;
  title: string;
  type: string;
  description: string;
  day: number;
  month: number;
};

const Calendar: React.FC = () => {
  
  const [messageApi, contextHolder] = message.useMessage();
  const [status, setStatus] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await GetEvents();
        const data = await res.json?.() ?? res.data;
  
        // แปลง format วันที่จาก backend (ถ้าเป็น ISO string) → ให้เป็น `day` และ `month`
        const mapped = data.map((event: EventInterface) => {
          const d = dayjs(event.Start);
          return {
            id: String(event.ID),
            time: d.format('HH:mm'),
            title: event.Title,
            type: event.Type,
            description: event.Description ?? '',
            day: d.date(),
            month: d.month(), // 0-based
          };
        });        
  
        setEvents(mapped);
      } catch (error) {
        console.error("Failed to load events:", error);
        messageApi.open({
          type: "error",
          content: "ไม่สามารถโหลด event ได้",
        });
      }
    };
  
    fetchEvents();
  }, []);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]); // <-- เริ่มด้วยข้อมูลว่าง
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    time: '',
    title: '',
    type: 'holiday',
    description: '',
    day: 0,
    month: currentDate.getMonth()
  });

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

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'holiday': return '✈️';
      case 'meeting': return '👥';
      case 'training': return '🎓';
      case 'other': return '●';
      default: return '○';
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
        e => e.day === day && e.month === month
      );
      
      const isToday = new Date().getDate() === day && 
                      new Date().getMonth() === month && 
                      new Date().getFullYear() === year;
      
      calendarDays.push(
        <div 
          key={`current-${day}`} 
          className={`calendar-day ${isToday ? 'today' : ''}`}
          onClick={() => handleDayClick(day)}
        >
          <div className="day-number">{day}</div>
          {dayEvents.map(event => (
            <div 
              key={event.id} 
              className={`event ${
                (event.type || '').replace('●', 'dot')
                                .replace('▲', 'triangle')
                                .replace('©', 'copyright')
                                .replace('@', 'at')
                                .replace('○', 'circle')
              }`}              
              onClick={(e) => {
                e.stopPropagation();
                handleEventClick(event);
              }}
            >
              <div className="event-time">
                <FiClock size={12} /> {event.time}
              </div>
              <div className="event-title">
                 {getTypeIcon(event.type)} {event.title}
              </div>
            </div>
          ))}
          {dayEvents.length === 0 && (
            <div className="add-event-placeholder" onClick={(e) => {
              e.stopPropagation();
              handleDayClick(day);
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

  const handleIcsUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    setStatus("📤 กำลังอัปโหลด...");

    try {
      const res = await UploadICS(formData);

      const result = await res.json?.() ?? res.data;

      if (res.ok || res.status === 200) {
        setStatus(`✅ Upload Success (${result.events_inserted} events)`);
        setTimeout(() => {
          window.location.href = '/admin/calendar';
        }, 2000);
      } else {
        setStatus(`❌ Upload Failed: ${result?.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Upload failed", err);
      setStatus("❌ Upload Failed: Network error");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleDayClick = (day: number) => {
    setNewEvent(prev => ({
      ...prev,
      day,
      month: currentDate.getMonth()
    }));
    setEditingEvent(null);
    setShowModal(true);
  };

  const handleEventClick = (event: Event) => {
    setEditingEvent(event);
    setNewEvent({
      time: event.time,
      title: event.title,
      type: event.type,
      description: event.description,
      day: event.day,
      month: event.month
    });
    setShowModal(true);
  };

  const handleSaveEvent = async () => {
    try {
      const newEventData: EventInterface = {
        ID: editingEvent?.id ? Number(editingEvent.id) : 0,
        Title: newEvent.title,
        Type: newEvent.type,
        Start: dayjs(`${currentDate.getFullYear()}-${newEvent.month + 1}-${newEvent.day}T${newEvent.time}`).toISOString(),
        Description: newEvent.description,
      };
  
      const res = editingEvent
        ? await UpdateEvents(editingEvent.id, newEventData)
        : await CreateEvents(newEventData);
  
      const result = await res.json?.() ?? res.data;
  
      if (result && result.ID) {
        const updatedEvent: Event = {
          id: result.ID.toString(),
          time: dayjs(result.Start).format('HH:mm'),
          title: result.Title,
          type: result.Type,
          description: result.Description,
          day: dayjs(result.Start).date(),
          month: dayjs(result.Start).month(),
        };
  
        setEvents((prev) => {
          if (editingEvent) {
            return prev.map((e) => (e.id === editingEvent.id ? updatedEvent : e));
          } else {
            return [...prev, updatedEvent];
          }
        });
  
        setShowModal(false);
        messageApi.open({
          type: 'success',
          content: editingEvent ? 'อัปเดต Event สำเร็จ!' : 'สร้าง Event สำเร็จ!'
        });
      } else {
        console.error("❌ Create/Update failed:", result);
        messageApi.open({
          type: 'error',
          content: editingEvent ? 'อัปเดต Event ไม่สำเร็จ!' : 'สร้าง Event ไม่สำเร็จ!'
        });
      }
    } catch (error) {
      console.error("❌ Error while saving event", error);
      messageApi.open({
        type: 'error',
        content: 'เกิดข้อผิดพลาด!'
      });
    }
  };
  
  const handleDeleteEvent = async () => {
    if (!editingEvent) return;
  
    try {
      const res = await DeleteEvents(editingEvent.id);
      if (res.ok || res.status === 200) {
        // ลบออกจาก state
        setEvents(events.filter(e => e.id !== editingEvent.id));
        setShowModal(false);
  
        messageApi.open({
          type: "success",
          content: "ลบ Event สำเร็จ!",
        });
      } else {
        messageApi.open({
          type: "error",
          content: "ลบ Event ไม่สำเร็จ!",
        });
      }
    } catch (error) {
      console.error("❌ Error while deleting event", error);
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดขณะลบ Event!",
      });
    }
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
      {contextHolder}
      <div className="calendar-header">
        <button className="nav-button" onClick={() => changeMonth(-1)}>
          <FiChevronLeft size={20} />
        </button>
        <h2>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
        <button className="nav-button" onClick={() => changeMonth(1)}>
          <FiChevronRight size={20} />
        </button>
        <div className="calendar-header-actions">
          <button 
            onClick={() => window.location.href = '/'}
            className="home-button"
          >
            <svg className="home-icon" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <span>Home</span>
          </button>
          <div className="compact-upload-container">
            <label htmlFor="ics-upload" className="compact-upload-label">
              <div className="compact-upload-content">
                <svg className="compact-upload-icon" viewBox="0 0 24 24">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                <span className="upload-text">Upload .ics</span>
              </div>
              <input
                id="ics-upload"
                type="file"
                accept=".ics"
                onChange={handleIcsUpload}
                disabled={isUploading}
                className="compact-upload-input"
              />
            </label>
            
            {isUploading && (
              <div className="compact-progress-bar" />
            )}
            
            {status && (
              <div className="compact-status">{status}</div>
            )}
          </div>
        </div>
      </div>
      <div className="calendar-grid-wrapper">
        <div className="calendar-grid">
          {daysOfWeek.map(day => (
            <div key={day} className="calendar-day-header">{day}</div>
          ))}
          {renderCalendar()}
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingEvent ? 'Edit Event' : 'Add Event'}</h3>
              <button className="close-button" onClick={() => setShowModal(false)}>
                <FiX size={20} />
              </button>
            </div>
            
            <div className="form-group">
              <label>
                <FiClock className="input-icon" /> Time:
              </label>
              <input 
                type="time" 
                value={newEvent.time}
                onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>
                <FiEdit2 className="input-icon" /> Title:
              </label>
              <input 
                type="text" 
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>
                <FiEdit2 className="input-icon" /> Description:
              </label>
              <input 
                type="text" 
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="type-selector-label">Event Type:</label>
              <div className="type-selector">
                {['holiday', 'meeting', 'training', 'other'].map((t) => (
                  <button
                    key={t}
                    className={`type-button ${newEvent.type === t ? 'active' : ''}`}
                    onClick={() => setNewEvent({ ...newEvent, type: t })}
                  >
                    <span className="type-icon">{getTypeIcon(t)}</span>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="modal-actions">
              {editingEvent && (
                <button className="delete-button" onClick={handleDeleteEvent}>
                  <FiTrash2 /> Delete
                </button>
              )}
              <button className="save-button" onClick={handleSaveEvent}>
                <FiSave /> Save
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        /* Modern Blue Theme Calendar */
        .calendar-container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          max-width: 80%;
          margin: 20px auto;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(219, 56, 56, 0.1);
          background: white;
        }

        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: linear-gradient(135deg, #1976d2, #2196f3);
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

        .calendar-grid-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 1px;
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
          background-color: rgb(251, 199, 199);
          overflow: hidden;
          text-overflow: ellipsis;
          cursor: pointer;
          transition: all 0.2s;
          border-left: 3px solid rgb(218, 0, 0);
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

        .dot {
          background: #e3f2fd;
          color: #1976d2;
          border-left-color: #1976d2;
        }

        .triangle {
          background: #e8f5e9;
          color: #388e3c;
          border-left-color: #388e3c;
        }

        .copyright {
          background: #fff3e0;
          color: #e65100;
          border-left-color: #e65100;
        }

        .at {
          background: #f3e5f5;
          color: #8e24aa;
          border-left-color: #8e24aa;
        }

        .circle {
          background: #e0f7fa;
          color: #00acc1;
          border-left-color: #00acc1;
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
          max-width: 30%;
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

        .form-group input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .form-group input:focus {
          outline: none;
          border-color: #1976d2;
          box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
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

        .calendar-header-actions {
          display: flex;
          gap: 10px;
          margin-left: auto;
        }

        .type-selector-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #555;
        }

        .type-selector {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .type-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 13px;
          color: #555;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .type-button:hover {
          border-color: #2196f3;
          color: #1976d2;
        }

        .type-button.active {
          background: #e3f2fd;
          border-color: #1976d2;
          color: #0d47a1;
          font-weight: 500;
        }

        .type-icon {
          display: inline-block;
          width: 16px;
          height: 16px;
          background: currentColor;
          border-radius: 50%;
          opacity: 0.7;
        }

        /* Different colors for each type */
        .type-button[class*="holiday"] .type-icon {
          background: #ff7043;
        }
        .type-button[class*="meeting"] .type-icon {
          background: #42a5f5;
        }
        .type-button[class*="training"] .type-icon {
          background: #66bb6a;
        }
        .type-button[class*="other"] .type-icon {
          background: #ba68c8;
        }

        /* Compact File Upload Styles */
        .compact-upload-container {
          max-width: 200px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 13px;
        }

        .upload-text {
          color: #1565c0;
          font-size: 14px;
          font-weight: 500;
        }

        .compact-upload-label {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border: 1px solid #2196f3;
          border-radius: 6px;
          background-color:rgb(253, 254, 255);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .compact-upload-label:hover {
          background-color: #e3f2fd;
          box-shadow: 0 1px 3px rgba(33, 150, 243, 0.2);
        }

        .compact-upload-icon {
          width: 14px;
          height: 14px;
          fill: #2196f3;
        }

        .compact-upload-input {
          display: none;
        }

        .compact-progress-bar {
          height: 2px;
          background: linear-gradient(90deg, #2196f3, #64b5f6);
          border-radius: 1px;
          margin-top: 4px;
          animation: compact-progress 1.5s ease-in-out infinite;
        }

        @keyframes compact-progress {
          0% { width: 0%; }
          50% { width: 100%; }
          100% { width: 0%; }
        }

        .compact-status {
          margin-top: 4px;
          padding: 4px 6px;
          border-radius: 4px;
          background: #e3f2fd;
          color: #0d47a1;
          font-size: 11px;
          line-height: 1.3;
        }

        /* Disabled state */
        .compact-upload-label:has(.compact-upload-input:disabled) {
          opacity: 0.6;
          cursor: not-allowed;
          border-color: #bdbdbd;
          background-color: #f5f5f5;
        }

        .compact-upload-label:has(.compact-upload-input:disabled):hover {
          box-shadow: none;
          background-color: #f5f5f5;
        }

        .compact-upload-label:has(.compact-upload-input:disabled) .compact-upload-icon {
          fill: #9e9e9e;
        }

        .home-button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background-color: #1976d2;
        color: white;
        border: none;
        border-radius: 8px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 2px 5px rgba(25, 118, 210, 0.2);
      }

      .home-button:hover {
        background-color: #1565c0;
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(25, 118, 210, 0.3);
      }

      .home-button:active {
        transform: translateY(0);
        box-shadow: 0 2px 3px rgba(25, 118, 210, 0.2);
      }

      .home-icon {
        width: 18px;
        height: 18px;
        fill: currentColor;
      }
      `}</style>
    </div>
  );
};

export default Calendar;