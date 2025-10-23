'use client';

import React, { useState } from 'react';
import { Calendar, Plus, Save, Trash2, Copy, Check } from 'lucide-react';

interface Preset {
  id: number;
  name: string;
  description: string;
  schedule: {
    [key: string]: {
      enabled: boolean;
      topic: string;
      time: string;
    };
  };
  platforms: {
    instagram: boolean;
    linkedin: boolean;
    facebook: boolean;
  };
  createdAt: string;
}

interface WeeklyPresetsManagerProps {
  presets: Preset[];
  setPresets: (presets: Preset[]) => void;
}

export default function WeeklyPresetsManager({ presets, setPresets }: WeeklyPresetsManagerProps) {
  // State for presets
  const [currentPreset, setCurrentPreset] = useState({
    name: '',
    description: '',
    schedule: {
      monday: { enabled: false, topic: 'recipes', time: '09:00' },
      tuesday: { enabled: false, topic: 'workouts', time: '09:00' },
      wednesday: { enabled: false, topic: 'realestate', time: '09:00' },
      thursday: { enabled: false, topic: 'mindfulness', time: '09:00' },
      friday: { enabled: false, topic: 'recipes', time: '09:00' },
      saturday: { enabled: false, topic: 'workouts', time: '09:00' },
      sunday: { enabled: false, topic: 'mindfulness', time: '09:00' }
    },
    platforms: {
      instagram: true,
      linkedin: false,
      facebook: false
    }
  });

  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Available topics
  const topicOptions = [
    { value: 'recipes', label: '🍳 Recipes' },
    { value: 'workouts', label: '💪 Workouts' },
    { value: 'realestate', label: '🏡 Real Estate' },
    { value: 'mindfulness', label: '🧘 Mindfulness' },
    { value: 'travel', label: '✈️ Travel' },
    { value: 'tech', label: '💻 Tech' },
    { value: 'finance', label: '💰 Finance' },
    { value: 'beauty', label: '✨ Beauty' },
    { value: 'parenting', label: '👶 Parenting' },
    { value: 'business', label: '📈 Business' },
    { value: 'lifestyle', label: '☕ Lifestyle' },
    { value: 'educational', label: '📚 Educational' },
    { value: 'motivational', label: '⚡ Motivational' }
  ];

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  // Toggle day in schedule
  const toggleDay = (day: string) => {
    setCurrentPreset(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day as keyof typeof prev.schedule],
          enabled: !prev.schedule[day as keyof typeof prev.schedule].enabled
        }
      }
    }));
  };

  // Update day topic
  const updateDayTopic = (day: string, topic: string) => {
    setCurrentPreset(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day as keyof typeof prev.schedule],
          topic
        }
      }
    }));
  };

  // Update day time
  const updateDayTime = (day: string, time: string) => {
    setCurrentPreset(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day as keyof typeof prev.schedule],
          time
        }
      }
    }));
  };

  // Toggle platform
  const togglePlatform = (platform: string) => {
    setCurrentPreset(prev => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [platform]: !prev.platforms[platform as keyof typeof prev.platforms]
      }
    }));
  };

  // Save preset
  const savePreset = () => {
    if (!currentPreset.name) {
      alert('Please enter a preset name');
      return;
    }

    const enabledDays = Object.entries(currentPreset.schedule)
      .filter(([_, config]) => config.enabled)
      .length;

    if (enabledDays === 0) {
      alert('Please select at least one day');
      return;
    }

    const newPreset: Preset = {
      ...currentPreset,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };

    setPresets([...presets, newPreset]);
    // Reset form
    setCurrentPreset({
      name: '',
      description: '',
      schedule: {
        monday: { enabled: false, topic: 'recipes', time: '09:00' },
        tuesday: { enabled: false, topic: 'workouts', time: '09:00' },
        wednesday: { enabled: false, topic: 'realestate', time: '09:00' },
        thursday: { enabled: false, topic: 'mindfulness', time: '09:00' },
        friday: { enabled: false, topic: 'recipes', time: '09:00' },
        saturday: { enabled: false, topic: 'workouts', time: '09:00' },
        sunday: { enabled: false, topic: 'mindfulness', time: '09:00' }
      },
      platforms: {
        instagram: true,
        linkedin: false,
        facebook: false
      }
    });
  };

  // Delete preset
  const deletePreset = (id: number) => {
    if (window.confirm('Are you sure you want to delete this preset?')) {
      setPresets(presets.filter(p => p.id !== id));
    }
  };

  // Apply preset
  const applyPreset = (preset: Preset) => {
    const enabledDays = Object.entries(preset.schedule)
      .filter(([_, config]) => config.enabled)
      .map(([day, _]) => day);
    
    const platforms = Object.entries(preset.platforms)
      .filter(([_, enabled]) => enabled)
      .map(([platform, _]) => platform);

    alert(`Preset "${preset.name}" ready to apply!\n\nDays: ${enabledDays.join(', ')}\nPlatforms: ${platforms.join(', ')}\n\nThis would integrate with your generateWeeklyContent function.`);
  };

  // Copy preset to clipboard
  const copyPresetToClipboard = (preset: Preset) => {
    const presetText = JSON.stringify(preset, null, 2);
    navigator.clipboard.writeText(presetText);
    setCopiedId(preset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Calendar className="w-8 h-8 text-amber-600" />
              <h1 className="text-3xl font-bold text-gray-800">Weekly Posting Presets</h1>
            </div>
            <p className="text-gray-600">Create and manage reusable weekly posting schedules</p>
          </div>
        </div>

        {/* Preset Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Create or Edit Preset</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Preset Name</label>
              <input
                type="text"
                value={currentPreset.name}
                onChange={(e) => setCurrentPreset({ ...currentPreset, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter preset name"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Description</label>
              <input
                type="text"
                value={currentPreset.description}
                onChange={(e) => setCurrentPreset({ ...currentPreset, description: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter preset description"
              />
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Schedule</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {days.map((day) => (
              <div key={day} className="bg-amber-50 p-4 rounded-lg shadow">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800 capitalize">{day}</h4>
                  <button
                    onClick={() => toggleDay(day)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      currentPreset.schedule[day as keyof typeof currentPreset.schedule].enabled ? 'bg-amber-600' : 'bg-gray-200'
                    }`}
                    aria-label={`Toggle ${day} schedule`}
                  >
                    {currentPreset.schedule[day as keyof typeof currentPreset.schedule].enabled ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Plus className="w-4 h-4 text-amber-600" />
                    )}
                  </button>
                </div>
                {currentPreset.schedule[day as keyof typeof currentPreset.schedule].enabled && (
                  <>
                    <div className="mb-2">
                      <label className="block text-gray-700 font-medium mb-1">Topic</label>
                      <select
                        value={currentPreset.schedule[day as keyof typeof currentPreset.schedule].topic}
                        onChange={(e) => updateDayTopic(day, e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        {topicOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Time</label>
                      <input
                        type="time"
                        value={currentPreset.schedule[day as keyof typeof currentPreset.schedule].time}
                        onChange={(e) => updateDayTime(day, e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Platforms</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.keys(currentPreset.platforms).map((platform) => (
              <div key={platform} className="bg-amber-50 p-4 rounded-lg shadow">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800 capitalize">{platform}</h4>
                  <button
                    onClick={() => togglePlatform(platform)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      currentPreset.platforms[platform as keyof typeof currentPreset.platforms] ? 'bg-amber-600' : 'bg-gray-200'
                    }`}
                    aria-label={`Toggle ${platform} platform`}
                  >
                    {currentPreset.platforms[platform as keyof typeof currentPreset.platforms] ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Plus className="w-4 h-4 text-amber-600" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={savePreset}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" /> Save Preset
            </button>
            <button
              onClick={() => setCurrentPreset({
                name: '',
                description: '',
                schedule: {
                  monday: { enabled: false, topic: 'recipes', time: '09:00' },
                  tuesday: { enabled: false, topic: 'workouts', time: '09:00' },
                  wednesday: { enabled: false, topic: 'realestate', time: '09:00' },
                  thursday: { enabled: false, topic: 'mindfulness', time: '09:00' },
                  friday: { enabled: false, topic: 'recipes', time: '09:00' },
                  saturday: { enabled: false, topic: 'workouts', time: '09:00' },
                  sunday: { enabled: false, topic: 'mindfulness', time: '09:00' }
                },
                platforms: {
                  instagram: true,
                  linkedin: false,
                  facebook: false
                }
              })}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" /> Discard Changes
            </button>
          </div>
        </div>

        {/* Preset List */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Saved Presets</h2>
          {presets.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No presets saved yet. Create a new preset!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {presets.map((preset) => (
                <div key={preset.id} className="bg-amber-50 p-4 rounded-lg shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">{preset.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => applyPreset(preset)}
                        className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1"
                        aria-label={`Apply preset ${preset.name}`}
                      >
                        <Check className="w-4 h-4" /> Apply
                      </button>
                      <button
                        onClick={() => copyPresetToClipboard(preset)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1"
                        aria-label={`Copy preset ${preset.name} to clipboard`}
                      >
                        {copiedId === preset.id ? (
                          <span className="text-green-600">Copied!</span>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" /> Copy
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => deletePreset(preset.id)}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1"
                        aria-label={`Delete preset ${preset.name}`}
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{preset.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(preset.schedule).map(([day, config]) => config.enabled && (
                      <span key={day} className="bg-amber-200 text-amber-800 rounded-full px-3 py-1 text-xs font-medium">
                        {day.charAt(0).toUpperCase() + day.slice(1)}: {config.topic} at {config.time}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2">
                    <span className="text-gray-500 text-xs">Platforms:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Object.entries(preset.platforms).map(([platform, enabled]) => enabled && (
                        <span key={platform} className="bg-amber-200 text-amber-800 rounded-full px-3 py-1 text-xs font-medium">
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
