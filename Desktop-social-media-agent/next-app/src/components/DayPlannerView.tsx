'use client';

import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Copy, Trash2 } from 'lucide-react';

interface PlannerPost {
  id: string | number;
  date: string;
  dayName: string;
  contentType: string;
  content: {
    title: string;
    description?: string;
  };
  variations: {
    instagram: string;
    linkedin: string;
    facebook: string;
  };
  status: string;
}

interface DayPlannerViewProps {
  contentCalendar: PlannerPost[];
  setContentCalendar: (posts: PlannerPost[]) => void;
}

const contentTypeColors: Record<string, string> = {
  recipes: 'bg-orange-100 text-orange-800 border-orange-400 hover:bg-orange-200',
  workouts: 'bg-green-100 text-green-800 border-green-400 hover:bg-green-200',
  realestate: 'bg-blue-100 text-blue-800 border-blue-400 hover:bg-blue-200',
  mindfulness: 'bg-purple-100 text-purple-800 border-purple-400 hover:bg-purple-200',
  motivational: 'bg-pink-100 text-pink-800 border-pink-400 hover:bg-pink-200',
  educational: 'bg-indigo-100 text-indigo-800 border-indigo-400 hover:bg-indigo-200',
  travel: 'bg-cyan-100 text-cyan-800 border-cyan-400 hover:bg-cyan-200',
  tech: 'bg-slate-100 text-slate-800 border-slate-400 hover:bg-slate-200',
  finance: 'bg-emerald-100 text-emerald-800 border-emerald-400 hover:bg-emerald-200',
  beauty: 'bg-rose-100 text-rose-800 border-rose-400 hover:bg-rose-200',
  parenting: 'bg-yellow-100 text-yellow-800 border-yellow-400 hover:bg-yellow-200',
  business: 'bg-gray-100 text-gray-800 border-gray-400 hover:bg-gray-200',
  lifestyle: 'bg-teal-100 text-teal-800 border-teal-400 hover:bg-teal-200',
};

const platforms = {
  instagram: { name: 'Instagram', icon: '📸' },
  linkedin: { name: 'LinkedIn', icon: '💼' },
  facebook: { name: 'Facebook', icon: '👥' },
};

export default function DayPlannerView({ contentCalendar, setContentCalendar }: DayPlannerViewProps) {
  const [calendarView, setCalendarView] = useState<'week' | 'day' | 'list'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getCalendarDays = (centerDate: Date, view: 'week' | 'day') => {
    if (view === 'day') return [centerDate];

    // Get week starting from Sunday
    const startOfWeek = new Date(centerDate);
    startOfWeek.setDate(centerDate.getDate() - centerDate.getDay());

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getContentForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return contentCalendar.filter(post => post.date === dateStr);
  };

  const navigateCalendar = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (calendarView === 'week') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
    setSelectedDate(newDate);
  };

  const deletePost = (id: string | number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setContentCalendar(contentCalendar.filter(post => post.id !== id));
    }
  };

  const copyToClipboard = (text: string, platform: string) => {
    navigator.clipboard.writeText(text);
    alert(`${platform} content copied to clipboard!`);
  };

  const formatDate = (date: Date, format: 'day' | 'full') => {
    if (format === 'day') return date.getDate().toString();
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <CalendarIcon className="w-6 h-6 text-amber-600" />
          <h2 className="text-2xl font-bold text-gray-900">Day Planner</h2>
          <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm font-medium">
            {contentCalendar.length} posts
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {/* View Toggle */}
          <div className="flex items-center space-x-1 border border-gray-300 rounded-lg p-1">
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
            <button
              onClick={() => setCalendarView('list')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                calendarView === 'list'
                  ? 'bg-amber-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              List
            </button>
          </div>

          {/* Navigation */}
          {calendarView !== 'list' && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateCalendar('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-semibold text-gray-900 min-w-[140px] text-center">
                {calendarView === 'week' && `Week of ${formatDate(getCalendarDays(currentDate, 'week')[0], 'full')}`}
                {calendarView === 'day' && currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
              <button
                onClick={() => navigateCalendar('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Week View */}
      {contentCalendar.length > 0 && calendarView === 'week' && (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {getCalendarDays(currentDate, 'week').map((date) => {
            const content = getContentForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <div key={date.toISOString()} className="space-y-2">
                <div className={`text-center p-2 rounded ${
                  isToday ? 'bg-amber-600 text-white' : 'bg-amber-50 text-gray-900'
                }`}>
                  <div className="text-xs font-medium">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-lg font-semibold">
                    {formatDate(date, 'day')}
                  </div>
                </div>

                <div className="space-y-2 min-h-[16rem]">
                  {content.map((post) => {
                    const colorClass = contentTypeColors[post.contentType] || contentTypeColors.motivational;
                    return (
                      <div
                        key={post.id}
                        className={`group relative p-3 rounded text-sm border-l-4 cursor-pointer hover:shadow-md transition-all ${colorClass.replace('hover:bg', 'bg').replace('100', '50')}`}
                        onClick={() => {
                          setSelectedDate(date);
                          setCalendarView('day');
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate">
                              {post.content.title}
                            </div>
                            <div className="text-gray-600 text-xs mt-1 capitalize">
                              {post.contentType}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deletePost(post.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {content.length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-8">
                      No posts
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Day View */}
      {contentCalendar.length > 0 && calendarView === 'day' && (
        <div className="space-y-4">
          {getContentForDate(currentDate).length === 0 ? (
            <div className="text-center py-12 bg-amber-50 rounded-lg">
              <p className="text-gray-500">No content scheduled for this day</p>
            </div>
          ) : (
            getContentForDate(currentDate).map((post) => {
              const colorClass = contentTypeColors[post.contentType] || contentTypeColors.motivational;
              return (
                <div key={post.id} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="font-semibold text-xl text-gray-900">{post.content.title}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        <span className={`px-3 py-1 rounded text-sm ${colorClass.split(' ')[0]} ${colorClass.split(' ')[1]}`}>
                          {post.contentType}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded transition-colors text-sm"
                      title="Delete this post"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>

                  {/* Platform Variations */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(platforms).map(([platform, config]) => (
                      <div key={platform} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-medium text-sm flex items-center gap-1">
                            <span>{config.icon}</span>
                            <span>{config.name}</span>
                          </span>
                          <button
                            onClick={() => copyToClipboard(post.variations[platform as keyof typeof post.variations], config.name)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            title="Copy to clipboard"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                        <div className="text-xs bg-white p-3 rounded border border-gray-200 max-h-48 overflow-y-auto whitespace-pre-wrap">
                          {post.variations[platform as keyof typeof post.variations]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* List View */}
      {contentCalendar.length > 0 && calendarView === 'list' && (
        <div className="space-y-3">
          {contentCalendar
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((post) => {
              const colorClass = contentTypeColors[post.contentType] || contentTypeColors.motivational;
              return (
                <div key={post.id} className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{post.content.title}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {new Date(post.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                        {' • '}
                        <span className={`ml-2 px-2 py-0.5 rounded text-xs ${colorClass.split(' ')[0]} ${colorClass.split(' ')[1]}`}>
                          {post.contentType}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Delete post"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {contentCalendar.length === 0 && (
        <div className="text-center py-16 bg-amber-50 rounded-lg">
          <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No content generated yet</p>
          <p className="text-gray-400 text-sm mt-2">Go to the AI Tools tab to generate your weekly content</p>
        </div>
      )}
    </div>
  );
}
