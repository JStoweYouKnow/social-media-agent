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
}

export default function CalendarComponent({ scheduledContent, setScheduledContent }: CalendarComponentProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('month');
  
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
          <Calendar className="w-6 h-6 text-amber-600" />
          <h2 className="text-2xl font-bold text-gray-900">Content Calendar</h2>
          <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm font-medium">
            {scheduledContent.length} scheduled
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export Buttons */}
          <button
            onClick={exportToCSV}
            disabled={scheduledContent.length === 0}
            className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            title="Export to CSV"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">CSV</span>
          </button>
          <button
            onClick={exportToJSON}
            disabled={scheduledContent.length === 0}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            title="Export to JSON"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">JSON</span>
          </button>
          <button
            onClick={printCalendar}
            disabled={scheduledContent.length === 0}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            title="Print Calendar"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* View Toggle */}
          <div className="flex items-center space-x-1 border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => setCalendarView('month')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                calendarView === 'month'
                  ? 'bg-amber-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setCalendarView('week')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                calendarView === 'week'
                  ? 'bg-amber-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setCalendarView('day')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                calendarView === 'day'
                  ? 'bg-amber-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Day
            </button>
          </div>

          {/* Calendar Navigation */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateCalendar('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900 min-w-[140px] text-center">
              {calendarView === 'month' && currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              {calendarView === 'week' && `Week of ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
              {calendarView === 'day' && currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </h3>
            <button
              onClick={() => navigateCalendar('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Days of week header */}
        {calendarView !== 'day' && (
          <div className={`grid ${calendarView === 'week' ? 'grid-cols-7' : 'grid-cols-7'} bg-gray-50 border-b`}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-600">
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
                className={`min-h-[120px] border-r border-b border-gray-200 p-2 cursor-pointer hover:bg-gray-50 ${
                  !isCurrentMonthDay ? 'bg-gray-50 text-gray-400' : ''
                } ${isTodayDate ? 'bg-amber-50' : ''} ${isSelected ? 'bg-amber-100' : ''}`}
                onClick={() => {
                  setSelectedDate(date);
                  setIsAddingContent(true);
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${
                    isTodayDate ? 'text-amber-600' : isCurrentMonthDay ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {date.getDate()}
                  </span>
                  {dayContent.length > 0 && (
                    <span className="bg-amber-500 text-white text-xs px-1 rounded-full">
                      {dayContent.length}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  {dayContent.slice(0, 2).map(content => (
                    <div
                      key={content.id}
                      className={`text-xs p-1 rounded truncate ${
                        content.status === 'published' ? 'bg-green-100 text-green-800' :
                        content.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
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
                    <div className="text-xs text-gray-500">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingId ? 'Edit' : 'Schedule'} Content
              </h3>
              <button
                onClick={() => {
                  setIsAddingContent(false);
                  setSelectedDate(null);
                  setEditingId(null);
                  setNewContent({ title: '', content: '', time: '09:00', platform: 'instagram', status: 'draft' });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newContent.title}
                  onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter content title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={newContent.content}
                  onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 h-20"
                  placeholder="Enter content description"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={newContent.time}
                    onChange={(e) => setNewContent({ ...newContent, time: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                  <select
                    value={newContent.platform}
                    onChange={(e) => setNewContent({ ...newContent, platform: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitter">Twitter</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={newContent.status}
                  onChange={(e) => setNewContent({ ...newContent, status: e.target.value as any })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleSaveContent}
                disabled={!newContent.title.trim()}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg transition-colors disabled:opacity-50"
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
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content List for Selected Date */}
      {selectedDate && !isAddingContent && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Content for {selectedDate.toLocaleDateString()}
          </h3>
          <div className="space-y-3">
            {getContentForDate(selectedDate).map(content => (
              <div key={content.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{content.title}</h4>
                  <p className="text-sm text-gray-600">{content.content}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-gray-500">{content.time}</span>
                    <span className="text-xs text-gray-500">{content.platform}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      content.status === 'published' ? 'bg-green-100 text-green-800' :
                      content.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {content.status}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditContent(content)}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteContent(content.id)}
                    className="p-1 text-gray-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {getContentForDate(selectedDate).length === 0 && (
              <p className="text-gray-500 text-center py-4">No content scheduled for this date.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
