'use client';

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus, Edit, Trash2, Check, Download, FileText, Printer } from 'lucide-react';

interface ScheduledContent {
  id: string;
  title: string;
  content: string;
  date: string;
  time: string;
  platform: string;
  status: 'draft' | 'scheduled' | 'published';
  createdAt: string;
}

interface CalendarComponentProps {
  scheduledContent: ScheduledContent[];
  setScheduledContent: (content: ScheduledContent[]) => void;
  onDateClick?: (date: Date) => void;
}

export default function CalendarComponent({ scheduledContent, setScheduledContent, onDateClick }: CalendarComponentProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day' | 'list'>('month');
  
  const [newContent, setNewContent] = useState({
    title: '',
    content: '',
    time: '09:00',
    platform: 'instagram',
    status: 'draft' as 'draft' | 'scheduled' | 'published'
  });

  const getCalendarDays = useMemo(() => {
    const year: number = currentDate.getFullYear();
    const month: number = currentDate.getMonth();
    const days: Date[] = [];

    if (calendarView === 'day') {
      // Just return the current day
      return [new Date(currentDate)];
    } else if (calendarView === 'week') {
      // Return current week (Sunday - Saturday)
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        days.push(day);
      }
      return days;
    } else {
      // Month view
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDate = new Date(firstDay);
      const endDate = new Date(lastDay);

      // Get first day of week (Sunday = 0)
      startDate.setDate(startDate.getDate() - startDate.getDay());
      endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

      const currentDay = new Date(startDate);

      while (currentDay <= endDate) {
        days.push(new Date(currentDay));
        currentDay.setDate(currentDay.getDate() + 1);
      }

      return days;
    }
  }, [currentDate, calendarView]);

  const getContentForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return scheduledContent.filter(content => content.date === dateStr);
  };

  const navigateCalendar = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (calendarView === 'month') {
        if (direction === 'prev') {
          newDate.setMonth(newDate.getMonth() - 1);
        } else {
          newDate.setMonth(newDate.getMonth() + 1);
        }
      } else if (calendarView === 'week') {
        if (direction === 'prev') {
          newDate.setDate(newDate.getDate() - 7);
        } else {
          newDate.setDate(newDate.getDate() + 7);
        }
      } else {
        // day
        if (direction === 'prev') {
          newDate.setDate(newDate.getDate() - 1);
        } else {
          newDate.setDate(newDate.getDate() + 1);
        }
      }
      return newDate;
    });
  };

  const exportToCSV = () => {
    if (scheduledContent.length === 0) {
      alert('No content to export. Please add some scheduled content first!');
      return;
    }

    const csvHeaders = ['Date', 'Time', 'Platform', 'Title', 'Content', 'Status'];
    const csvRows = scheduledContent
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(post => {
        const content = `"${post.content.replace(/"/g, '""')}"`;
        const title = `"${post.title.replace(/"/g, '""')}"`;
        return [post.date, post.time, post.platform, title, content, post.status].join(',');
      });

    const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `content-calendar-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  const exportToJSON = () => {
    if (scheduledContent.length === 0) {
      alert('No content to export. Please add some scheduled content first!');
      return;
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      totalPosts: scheduledContent.length,
      posts: scheduledContent
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(post => ({
          date: post.date,
          time: post.time,
          platform: post.platform,
          title: post.title,
          content: post.content,
          status: post.status,
          createdAt: post.createdAt
        }))
    };

    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `content-calendar-${new Date().toISOString().split('T')[0]}.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  const printCalendar = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <html>
        <head>
          <title>Post Planner Calendar</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #2c3e50; border-bottom: 2px solid #f59e0b; padding-bottom: 10px; }
            .post { margin: 15px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
            .date { font-weight: bold; color: #f59e0b; }
            .title { font-size: 16px; font-weight: bold; margin: 5px 0; }
            .content { color: #555; margin: 5px 0; }
            .meta { font-size: 12px; color: #888; }
          </style>
        </head>
        <body>
          <h1>Post Planner Calendar - Generated ${new Date().toLocaleDateString()}</h1>
          ${scheduledContent.length === 0 ? '<p>No content scheduled.</p>' :
            scheduledContent
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map(item => `
                <div class="post">
                  <div class="date">${new Date(item.date).toLocaleDateString()} at ${item.time}</div>
                  <div class="title">${item.title || 'Untitled'}</div>
                  <div class="content">${item.content || 'No content'}</div>
                  <div class="meta">Platform: ${item.platform} | Status: ${item.status}</div>
                </div>
              `).join('')
          }
        </body>
      </html>
    `;
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleSaveContent = () => {
    if (!newContent.title.trim() || !selectedDate) return;

    const content: ScheduledContent = {
      id: editingId || Date.now().toString(),
      title: newContent.title,
      content: newContent.content,
      date: selectedDate.toISOString().split('T')[0],
      time: newContent.time,
      platform: newContent.platform,
      status: newContent.status,
      createdAt: new Date().toISOString()
    };

    if (editingId) {
      setScheduledContent(scheduledContent.map(c => c.id === editingId ? content : c));
      setEditingId(null);
    } else {
      setScheduledContent([...scheduledContent, content]);
    }

    setNewContent({ title: '', content: '', time: '09:00', platform: 'instagram', status: 'draft' });
    setIsAddingContent(false);
    setSelectedDate(null);
  };

  const handleDeleteContent = (id: string) => {
    if (window.confirm('Are you sure you want to delete this scheduled content?')) {
      setScheduledContent(scheduledContent.filter(c => c.id !== id));
    }
  };

  const handleEditContent = (content: ScheduledContent) => {
    setNewContent({
      title: content.title,
      content: content.content,
      time: content.time,
      platform: content.platform,
      status: content.status
    });
    setEditingId(content.id);
    setSelectedDate(new Date(content.date));
    setIsAddingContent(true);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-planner-accent/10 rounded-xl">
            <Calendar className="w-6 h-6 text-planner-accent" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-planner-text">Content Calendar</h2>
          <span className="bg-planner-accent/20 text-planner-accent px-3 py-1 rounded-full text-sm font-medium">
            {scheduledContent.length} scheduled
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export Buttons */}
          <button
            onClick={exportToCSV}
            disabled={scheduledContent.length === 0}
            className="btn-primary flex items-center gap-2 text-sm"
            title="Export to CSV"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">CSV</span>
          </button>
          <button
            onClick={exportToJSON}
            disabled={scheduledContent.length === 0}
            className="btn-secondary flex items-center gap-2 text-sm"
            title="Export to JSON"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">JSON</span>
          </button>
          <button
            onClick={printCalendar}
            disabled={scheduledContent.length === 0}
            className="btn-secondary flex items-center gap-2 text-sm"
            title="Print Calendar"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* View Toggle */}
          <div className="flex items-center gap-1 border border-planner-border rounded-lg p-1 bg-planner-page shadow-planner">
            <button
              onClick={() => setCalendarView('month')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                calendarView === 'month'
                  ? 'bg-planner-accent text-white shadow-planner'
                  : 'text-planner-text-medium hover:bg-planner-hover'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setCalendarView('week')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                calendarView === 'week'
                  ? 'bg-planner-accent text-white shadow-planner'
                  : 'text-planner-text-medium hover:bg-planner-hover'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setCalendarView('day')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                calendarView === 'day'
                  ? 'bg-planner-accent text-white shadow-planner'
                  : 'text-planner-text-medium hover:bg-planner-hover'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setCalendarView('list')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                calendarView === 'list'
                  ? 'bg-planner-accent text-white shadow-planner'
                  : 'text-planner-text-medium hover:bg-planner-hover'
              }`}
            >
              List
            </button>
          </div>

          {/* Calendar Navigation */}
          <div className="flex items-center gap-2 border border-planner-border rounded-lg p-1 bg-planner-page shadow-planner">
            <button
              onClick={() => navigateCalendar('prev')}
              className="p-2 hover:bg-planner-hover rounded-lg transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-planner-text" />
            </button>
            <h3 className="text-base font-semibold text-planner-text min-w-[140px] text-center">
              {calendarView === 'month' && currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              {calendarView === 'week' && `Week of ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
              {calendarView === 'day' && currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </h3>
            <button
              onClick={() => navigateCalendar('next')}
              className="p-2 hover:bg-planner-hover rounded-lg transition-all"
            >
              <ChevronRight className="w-5 h-5 text-planner-text" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="card overflow-hidden shadow-planner-xl">
        {/* Days of week header */}
        {calendarView !== 'day' && (
          <div className={`grid ${calendarView === 'week' ? 'grid-cols-7' : 'grid-cols-7'} bg-planner-sidebar border-b border-planner-border`}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-3 text-center text-sm font-semibold text-planner-text-medium">
                {day}
              </div>
            ))}
          </div>
        )}

        {/* Calendar days */}
        <div className={`grid ${calendarView === 'day' ? 'grid-cols-1' : calendarView === 'week' ? 'grid-cols-7' : 'grid-cols-7'}`}>
          {getCalendarDays.map((date, index) => {
            const dayContent = getContentForDate(date);
            const isCurrentMonthDay = isCurrentMonth(date);
            const isTodayDate = isToday(date);
            const isSelected = selectedDate?.toDateString() === date.toDateString();

            return (
              <div
                key={index}
                className={`min-h-[120px] border-r border-b border-planner-border p-3 cursor-pointer transition-all duration-200 ${
                  !isCurrentMonthDay ? 'bg-planner-sidebar/50 text-planner-text-muted' : 'bg-white hover:bg-planner-page/30'
                } ${isTodayDate ? 'bg-planner-accent/10 border-l-4 border-l-planner-accent' : ''} ${isSelected ? 'bg-planner-accent/20 ring-2 ring-planner-accent ring-inset' : ''}`}
                onClick={() => {
                  setSelectedDate(date);
                  // If day has content, show list view for that day
                  if (dayContent.length > 0) {
                    // This will show the day's content in the existing view below
                    setIsAddingContent(false);
                  } else {
                    // Open date - navigate to planner
                    if (onDateClick && !isTodayDate) {
                      onDateClick(date);
                    } else {
                      setIsAddingContent(true);
                    }
                  }
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-semibold ${
                    isTodayDate ? 'text-planner-accent' : isCurrentMonthDay ? 'text-planner-text' : 'text-planner-text-muted'
                  }`}>
                    {date.getDate()}
                  </span>
                  {dayContent.length > 0 && (
                    <span className="bg-planner-accent text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-planner">
                      {dayContent.length}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  {dayContent.slice(0, 2).map(content => (
                    <div
                      key={content.id}
                      className={`text-xs p-1.5 rounded-md truncate font-medium transition-all hover:scale-105 cursor-pointer ${
                        content.status === 'published' ? 'bg-green-100 text-green-800 border border-green-200' :
                        content.status === 'scheduled' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                        'bg-planner-page text-planner-text-medium border border-planner-border'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditContent(content);
                      }}
                    >
                      {content.title}
                    </div>
                  ))}
                  {dayContent.length > 2 && (
                    <div className="text-xs text-planner-text-muted font-medium">
                      +{dayContent.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add/Edit Content Modal */}
      {isAddingContent && selectedDate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full shadow-planner-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-serif font-semibold text-planner-text">
                {editingId ? 'Edit' : 'Schedule'} Content
              </h3>
              <button
                onClick={() => {
                  setIsAddingContent(false);
                  setSelectedDate(null);
                  setEditingId(null);
                  setNewContent({ title: '', content: '', time: '09:00', platform: 'instagram', status: 'draft' });
                }}
                className="text-planner-text-muted hover:text-planner-text text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-planner-text-medium mb-2">Date</label>
                <input
                  type="date"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="input-planner"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-planner-text-medium mb-2">Title</label>
                <input
                  type="text"
                  value={newContent.title}
                  onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                  className="input-planner"
                  placeholder="Enter content title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-planner-text-medium mb-2">Content</label>
                <textarea
                  value={newContent.content}
                  onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
                  className="textarea-planner h-20"
                  placeholder="Enter content description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-planner-text-medium mb-2">Time</label>
                  <input
                    type="time"
                    value={newContent.time}
                    onChange={(e) => setNewContent({ ...newContent, time: e.target.value })}
                    className="input-planner"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-planner-text-medium mb-2">Platform</label>
                  <select
                    value={newContent.platform}
                    onChange={(e) => setNewContent({ ...newContent, platform: e.target.value })}
                    className="input-planner"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitter">Twitter</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-planner-text-medium mb-2">Status</label>
                <select
                  value={newContent.status}
                  onChange={(e) => setNewContent({ ...newContent, status: e.target.value as any })}
                  className="input-planner"
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleSaveContent}
                disabled={!newContent.title.trim()}
                className="btn-primary flex-1"
              >
                {editingId ? 'Update' : 'Schedule'}
              </button>
              <button
                onClick={() => {
                  setIsAddingContent(false);
                  setSelectedDate(null);
                  setEditingId(null);
                  setNewContent({ title: '', content: '', time: '09:00', platform: 'instagram', status: 'draft' });
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content List for Selected Date - Only show if date has content */}
      {selectedDate && !isAddingContent && getContentForDate(selectedDate).length > 0 && (
        <div className="card shadow-planner-xl">
          <h3 className="text-xl font-serif font-semibold text-planner-text mb-6">
            Content for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </h3>
          <div className="space-y-3">
            {getContentForDate(selectedDate).map(content => (
              <div key={content.id} className="flex items-center justify-between p-4 bg-planner-page rounded-xl border border-planner-border hover:shadow-planner-lg transition-all">
                <div className="flex-1">
                  <h4 className="font-semibold text-planner-text text-base mb-1">{content.title}</h4>
                  <p className="text-sm text-planner-text-muted mb-2">{content.content}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-planner-text-medium font-medium">{content.time}</span>
                    <span className="text-xs text-planner-text-medium font-medium capitalize">{content.platform}</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      content.status === 'published' ? 'bg-green-100 text-green-800 border border-green-200' :
                      content.status === 'scheduled' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                      'bg-planner-page text-planner-text-medium border border-planner-border'
                    }`}>
                      {content.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditContent(content)}
                    className="p-2 text-planner-text-muted hover:text-planner-accent rounded-lg hover:bg-planner-hover transition-all"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteContent(content.id)}
                    className="p-2 text-planner-text-muted hover:text-red-600 rounded-lg hover:bg-planner-hover transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List View */}
      {calendarView === 'list' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-serif font-semibold text-planner-text">All Scheduled Content</h3>
            <button
              onClick={() => {
                setSelectedDate(new Date());
                setIsAddingContent(true);
              }}
              className="flex items-center gap-2 btn-primary"
            >
              <Plus className="w-4 h-4" />
              Add Content
            </button>
          </div>

          <div className="space-y-3">
            {scheduledContent
              .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime())
              .map(content => (
                <div
                  key={content.id}
                  className="card hover:shadow-planner transition-all cursor-pointer"
                  onClick={() => {
                    if (onDateClick) {
                      onDateClick(new Date(content.date));
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-planner-text">{content.title}</h4>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          content.status === 'published' ? 'bg-green-100 text-green-800 border border-green-200' :
                          content.status === 'scheduled' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          'bg-planner-page text-planner-text-medium border border-planner-border'
                        }`}>
                          {content.status}
                        </span>
                      </div>
                      <p className="text-planner-text-medium text-sm mb-2">{content.content}</p>
                      <div className="flex items-center gap-4 text-xs text-planner-text-muted">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(content.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1">
                          🕐 {content.time}
                        </span>
                        <span className="capitalize">{content.platform}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditContent(content);
                        }}
                        className="p-2 text-planner-text-muted hover:text-planner-accent rounded-lg hover:bg-planner-hover transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteContent(content.id);
                        }}
                        className="p-2 text-planner-text-muted hover:text-red-600 rounded-lg hover:bg-planner-hover transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            {scheduledContent.length === 0 && (
              <div className="text-center py-16 bg-planner-border/10 rounded-xl">
                <FileText className="w-16 h-16 text-planner-border mx-auto mb-4" />
                <p className="text-planner-text/60 text-lg font-medium">No content scheduled yet</p>
                <p className="text-planner-text/40 text-sm mt-2">Click the "Add Content" button to get started</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
