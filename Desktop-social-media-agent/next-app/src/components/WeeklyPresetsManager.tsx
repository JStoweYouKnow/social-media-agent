'use client';

import React, { useState, useRef } from 'react';
import { Calendar, Save, Trash2, Copy, Check, Upload, FileJson, FileSpreadsheet, Download } from 'lucide-react';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Export all presets as JSON
  const exportPresetsJSON = () => {
    const dataStr = JSON.stringify(presets, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `presets-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export all presets as CSV
  const exportPresetsCSV = () => {
    const headers = ['Name', 'Description', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Instagram', 'LinkedIn', 'Facebook'];
    const rows = presets.map(preset => {
      const daysData = days.map(day => {
        const dayConfig = preset.schedule[day as keyof typeof preset.schedule];
        return dayConfig.enabled ? `${dayConfig.topic}@${dayConfig.time}` : '';
      });
      return [
        preset.name,
        preset.description,
        ...daysData,
        preset.platforms.instagram ? 'Yes' : 'No',
        preset.platforms.linkedin ? 'Yes' : 'No',
        preset.platforms.facebook ? 'Yes' : 'No'
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `presets-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Parse and validate preset from JSON
  const parseJSONPreset = (jsonData: any): Preset | null => {
    try {
      // Validate required fields
      if (!jsonData.name || typeof jsonData.name !== 'string') {
        throw new Error('Invalid or missing name');
      }

      // Ensure schedule exists
      if (!jsonData.schedule || typeof jsonData.schedule !== 'object') {
        throw new Error('Invalid or missing schedule');
      }

      // Ensure platforms exist
      if (!jsonData.platforms || typeof jsonData.platforms !== 'object') {
        throw new Error('Invalid or missing platforms');
      }

      return {
        id: Date.now() + Math.random(),
        name: jsonData.name,
        description: jsonData.description || '',
        schedule: jsonData.schedule,
        platforms: {
          instagram: jsonData.platforms.instagram !== false,
          linkedin: jsonData.platforms.linkedin === true,
          facebook: jsonData.platforms.facebook === true
        },
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error parsing JSON preset:', error);
      return null;
    }
  };

  // Parse CSV row into preset
  const parseCSVPreset = (row: string[], headers: string[]): Preset | null => {
    try {
      const getValue = (header: string) => {
        const index = headers.findIndex(h => h.toLowerCase().includes(header.toLowerCase()));
        return index >= 0 ? row[index]?.replace(/^"|"$/g, '') : '';
      };

      const name = getValue('name');
      if (!name) throw new Error('Missing name');

      const schedule: any = {};
      days.forEach(day => {
        const dayValue = getValue(day);
        if (dayValue) {
          const [topic, time] = dayValue.split('@');
          schedule[day] = {
            enabled: true,
            topic: topic || 'recipes',
            time: time || '09:00'
          };
        } else {
          schedule[day] = {
            enabled: false,
            topic: 'recipes',
            time: '09:00'
          };
        }
      });

      return {
        id: Date.now() + Math.random(),
        name,
        description: getValue('description') || '',
        schedule,
        platforms: {
          instagram: getValue('instagram').toLowerCase() !== 'no',
          linkedin: getValue('linkedin').toLowerCase() === 'yes',
          facebook: getValue('facebook').toLowerCase() === 'yes'
        },
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error parsing CSV row:', error);
      return null;
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;

      if (file.name.endsWith('.json')) {
        try {
          const jsonData = JSON.parse(content);
          const presetsToImport: Preset[] = [];

          // Handle both single preset and array of presets
          const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];

          dataArray.forEach(item => {
            const parsed = parseJSONPreset(item);
            if (parsed) presetsToImport.push(parsed);
          });

          if (presetsToImport.length > 0) {
            setPresets([...presets, ...presetsToImport]);
            alert(`Successfully imported ${presetsToImport.length} preset(s)!`);
          } else {
            alert('No valid presets found in the file.');
          }
        } catch (error) {
          alert('Error parsing JSON file. Please check the format.');
          console.error(error);
        }
      } else if (file.name.endsWith('.csv')) {
        try {
          const lines = content.split('\n').filter(line => line.trim());
          if (lines.length < 2) {
            alert('CSV file is empty or invalid.');
            return;
          }

          const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
          const presetsToImport: Preset[] = [];

          for (let i = 1; i < lines.length; i++) {
            const row = lines[i].split(',');
            const parsed = parseCSVPreset(row, headers);
            if (parsed) presetsToImport.push(parsed);
          }

          if (presetsToImport.length > 0) {
            setPresets([...presets, ...presetsToImport]);
            alert(`Successfully imported ${presetsToImport.length} preset(s) from CSV!`);
          } else {
            alert('No valid presets found in the CSV file.');
          }
        } catch (error) {
          alert('Error parsing CSV file. Please check the format.');
          console.error(error);
        }
      } else {
        alert('Please upload a .json or .csv file.');
      }
    };

    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Calendar className="w-6 h-6 text-planner-accent" />
            <h2 className="text-2xl font-serif font-bold text-planner-text">Daily Topic Presets</h2>
          </div>
          <span className="text-sm text-planner-text-medium">Create and manage reusable daily posting schedules</span>
        </div>

        {/* Import/Export Buttons */}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary flex items-center gap-2 text-sm"
            title="Import presets from JSON or CSV"
          >
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </button>
          <div className="relative group">
            <button
              className="btn-secondary flex items-center gap-2 text-sm"
              title="Export presets"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            {/* Dropdown menu */}
            <div className="absolute right-0 mt-1 w-40 bg-white border border-planner-border rounded-lg shadow-planner-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <button
                onClick={exportPresetsJSON}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-planner-text hover:bg-planner-hover rounded-t-lg"
              >
                <FileJson className="w-4 h-4 text-blue-600" />
                <span>Export as JSON</span>
              </button>
              <button
                onClick={exportPresetsCSV}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-planner-text hover:bg-planner-hover rounded-b-lg"
              >
                <FileSpreadsheet className="w-4 h-4 text-green-600" />
                <span>Export as CSV</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Form */}
      <div className="planner-section p-8">
        <h3 className="planner-header text-2xl text-planner-text">New Preset</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="planner-line">
            <label className="block text-planner-text text-xs font-bold mb-3 uppercase tracking-wider">Preset Name</label>
            <input
              type="text"
              value={currentPreset.name}
              onChange={(e) => setCurrentPreset({ ...currentPreset, name: e.target.value })}
              className="w-full border-b-2 border-planner-text bg-transparent px-0 py-2 text-planner-text text-lg focus:outline-none focus:border-planner-accent transition-colors font-serif"
              placeholder="e.g., Daily Content Plan"
            />
          </div>
          <div className="planner-line">
            <label className="block text-planner-text text-xs font-bold mb-3 uppercase tracking-wider">Description</label>
            <input
              type="text"
              value={currentPreset.description}
              onChange={(e) => setCurrentPreset({ ...currentPreset, description: e.target.value })}
              className="w-full border-b-2 border-planner-text bg-transparent px-0 py-2 text-planner-text text-lg focus:outline-none focus:border-planner-accent transition-colors font-serif"
              placeholder="Brief description"
            />
          </div>
        </div>

        <div className="planner-divider"></div>

        <h4 className="planner-subheader text-planner-text">Daily Schedule</h4>
        <div className="planner-grid grid-cols-1 sm:grid-cols-2">
          {days.map((day) => (
            <div key={day} className="planner-cell">
              <div className="flex items-start gap-3 mb-3">
                <input
                  type="checkbox"
                  checked={currentPreset.schedule[day as keyof typeof currentPreset.schedule].enabled}
                  onChange={() => toggleDay(day)}
                  className="planner-checkbox mt-1"
                  aria-label={`Toggle ${day} schedule`}
                />
                <div className="flex-1">
                  <h5 className="font-bold text-planner-text capitalize text-lg font-serif mb-1">{day}</h5>
                  {currentPreset.schedule[day as keyof typeof currentPreset.schedule].enabled && (
                    <div className="space-y-3 mt-3 pl-1 border-l-2 border-planner-border">
                      <div className="pl-3">
                        <label className="block text-planner-text text-xs font-bold mb-1.5 uppercase tracking-wide">Topic</label>
                        <select
                          value={currentPreset.schedule[day as keyof typeof currentPreset.schedule].topic}
                          onChange={(e) => updateDayTopic(day, e.target.value)}
                          className="w-full border-b border-planner-text bg-transparent py-1 text-planner-text text-sm focus:outline-none focus:border-planner-accent"
                        >
                          {topicOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="pl-3">
                        <label className="block text-planner-text text-xs font-bold mb-1.5 uppercase tracking-wide">Time</label>
                        <input
                          type="time"
                          value={currentPreset.schedule[day as keyof typeof currentPreset.schedule].time}
                          onChange={(e) => updateDayTime(day, e.target.value)}
                          className="w-full border-b border-planner-text bg-transparent py-1 text-planner-text text-sm focus:outline-none focus:border-planner-accent"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="planner-divider"></div>

        <h4 className="planner-subheader text-planner-text">Publishing Platforms</h4>
        <div className="space-y-3">
          {Object.keys(currentPreset.platforms).map((platform) => (
            <div key={platform} className="planner-line flex items-center gap-3">
              <input
                type="checkbox"
                checked={currentPreset.platforms[platform as keyof typeof currentPreset.platforms]}
                onChange={() => togglePlatform(platform)}
                className="planner-checkbox"
                aria-label={`Toggle ${platform} platform`}
              />
              <label className="text-planner-text font-semibold capitalize flex-1 cursor-pointer" onClick={() => togglePlatform(platform)}>
                {platform}
              </label>
            </div>
          ))}
        </div>

        <div className="planner-divider"></div>

        <div className="flex gap-4">
          <button
            onClick={savePreset}
            className="flex-1 bg-planner-text hover:bg-planner-text/90 text-white font-bold py-3 px-6 border-2 border-planner-text transition-all uppercase tracking-wider text-sm"
          >
            <Save className="w-4 h-4 inline mr-2" />
            Save Preset
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
            className="flex-1 bg-white hover:bg-planner-page text-planner-text font-bold py-3 px-6 border-2 border-planner-text transition-all uppercase tracking-wider text-sm"
          >
            <Trash2 className="w-4 h-4 inline mr-2" />
            Clear Form
          </button>
        </div>
      </div>

      {/* Preset List */}
      <div className="planner-section p-8">
        <h3 className="planner-header text-2xl text-planner-text">Saved Presets</h3>
        {presets.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 border-2 border-dashed border-planner-border rounded mx-auto mb-4"></div>
            <p className="text-planner-text-muted text-sm">No presets saved yet. Create your first preset above!</p>
          </div>
        ) : (
          <div className="space-y-1">
            {presets.map((preset, index) => (
              <div key={preset.id} className={`planner-line ${index === presets.length - 1 ? 'border-b-0' : ''}`}>
                <div className="flex items-start justify-between gap-4 py-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-planner-text text-lg font-serif mb-1">{preset.name}</h4>
                    <p className="text-planner-text-muted text-sm mb-3">{preset.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {Object.entries(preset.schedule).map(([day, config]) => config.enabled && (
                        <span key={day} className="text-planner-text border-b border-planner-text pb-0.5 font-mono">
                          {day.slice(0, 3).toUpperCase()}: {config.topic} @ {config.time}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-2 text-xs">
                      {Object.entries(preset.platforms).map(([platform, enabled]) => enabled && (
                        <span key={platform} className="text-planner-text-medium uppercase tracking-wider font-bold">
                          □ {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => applyPreset(preset)}
                      className="bg-planner-text hover:bg-planner-text/90 text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider border-2 border-planner-text transition-all"
                      aria-label={`Apply preset ${preset.name}`}
                      title="Apply"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => copyPresetToClipboard(preset)}
                      className="bg-white hover:bg-planner-page text-planner-text px-3 py-1.5 text-xs font-bold uppercase tracking-wider border-2 border-planner-text transition-all"
                      aria-label={`Copy preset ${preset.name} to clipboard`}
                      title="Copy"
                    >
                      {copiedId === preset.id ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => deletePreset(preset.id)}
                      className="bg-white hover:bg-red-50 text-red-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wider border-2 border-red-600 transition-all"
                      aria-label={`Delete preset ${preset.name}`}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
