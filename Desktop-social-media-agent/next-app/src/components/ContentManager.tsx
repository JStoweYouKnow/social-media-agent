'use client';

import React, { useState, useCallback } from 'react';
import { Plus, Save, Trash2, Edit, Eye, Copy, Check, ChefHat, Dumbbell, Building, Heart, Plane, Smartphone, DollarSign, Sparkles, Target, Coffee, GraduationCap, Zap, X } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  content: string;
  tags: string;
  url?: string;
  field1?: string;
  field2?: string;
  createdAt: string;
  used?: boolean;
}

interface ContentManagerProps {
  content: ContentItem[];
  setContent: (content: ContentItem[]) => void;
  contentType: string;
}

const topicOptions = [
  { value: 'recipes', label: '🍳 Recipes', icon: ChefHat, fields: ['Ingredients', 'Cooking Time'] },
  { value: 'workouts', label: '💪 Workouts', icon: Dumbbell, fields: ['Duration', 'Difficulty'] },
  { value: 'realestate', label: '🏡 Real Estate', icon: Building, fields: ['Property Type', 'Market Area'] },
  { value: 'mindfulness', label: '🧘 Mindfulness', icon: Heart, fields: ['Practice Type', 'Duration'] },
  { value: 'travel', label: '✈️ Travel', icon: Plane, fields: ['Destination', 'Trip Type'] },
  { value: 'tech', label: '💻 Tech', icon: Smartphone, fields: ['Category', 'Skill Level'] },
  { value: 'finance', label: '💰 Finance', icon: DollarSign, fields: ['Type', 'Amount Range'] },
  { value: 'beauty', label: '✨ Beauty', icon: Sparkles, fields: ['Category', 'Skin Type'] },
  { value: 'business', label: '📈 Business', icon: Target, fields: ['Industry', 'Business Stage'] },
  { value: 'lifestyle', label: '☕ Lifestyle', icon: Coffee, fields: ['Category', 'Season'] },
  { value: 'educational', label: '📚 Educational', icon: GraduationCap, fields: ['Subject', 'Level'] },
  { value: 'motivational', label: '⚡ Motivational', icon: Zap, fields: ['Theme', 'Audience'] }
];

export default function ContentManager({ content, setContent, contentType }: ContentManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const [newItem, setNewItem] = useState({
    title: '',
    content: '',
    tags: '',
    url: '',
    field1: '',
    field2: ''
  });

  const currentTopic = topicOptions.find(topic => topic.value === contentType);

  const handleSave = useCallback(() => {
    if (!newItem.title.trim()) return;

    const item: ContentItem = {
      id: editingId || Date.now().toString(),
      title: newItem.title,
      content: newItem.content,
      tags: newItem.tags,
      url: newItem.url,
      field1: newItem.field1,
      field2: newItem.field2,
      createdAt: new Date().toISOString(),
      used: false
    };

    if (editingId) {
      setContent(content.map(c => c.id === editingId ? item : c));
      setEditingId(null);
    } else {
      setContent([...content, item]);
    }

    setNewItem({ title: '', content: '', tags: '', url: '', field1: '', field2: '' });
    setIsAdding(false);
  }, [newItem, editingId, content, setContent]);

  const handleEdit = useCallback((item: ContentItem) => {
    setNewItem({
      title: item.title,
      content: item.content,
      tags: item.tags,
      url: item.url || '',
      field1: item.field1 || '',
      field2: item.field2 || ''
    });
    setEditingId(item.id);
    setIsAdding(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setContent(content.filter(c => c.id !== id));
    }
  }, [content, setContent]);

  const handleCopy = useCallback((item: ContentItem) => {
    const text = `${item.title}\n\n${item.content}\n\n${item.tags}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleMarkUsed = useCallback((id: string) => {
    setContent(content.map(c => c.id === id ? { ...c, used: !c.used } : c));
  }, [content, setContent]);

  const IconComponent = currentTopic?.icon || Plus;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <IconComponent className="w-6 h-6 text-amber-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            {currentTopic?.label || 'Content'} Library
          </h2>
          <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm font-medium">
            {content.length} items
          </span>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add {currentTopic?.label || 'Content'}</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit' : 'Add New'} {currentTopic?.label || 'Content'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder={`Enter ${currentTopic?.label || 'content'} title`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                value={newItem.content}
                onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 h-24"
                placeholder={`Enter ${currentTopic?.label || 'content'} description`}
              />
            </div>

            {currentTopic?.fields && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{currentTopic.fields[0]}</label>
                  <input
                    type="text"
                    value={newItem.field1}
                    onChange={(e) => setNewItem({ ...newItem, field1: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder={`Enter ${currentTopic.fields[0].toLowerCase()}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{currentTopic.fields[1]}</label>
                  <input
                    type="text"
                    value={newItem.field2}
                    onChange={(e) => setNewItem({ ...newItem, field2: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder={`Enter ${currentTopic.fields[1].toLowerCase()}`}
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <input
                type="text"
                value={newItem.tags}
                onChange={(e) => setNewItem({ ...newItem, tags: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter tags (comma separated)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL (optional)</label>
              <input
                type="url"
                value={newItem.url}
                onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={handleSave}
              disabled={!newItem.title.trim()}
              className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{editingId ? 'Update' : 'Save'}</span>
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                setNewItem({ title: '', content: '', tags: '', url: '', field1: '', field2: '' });
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Content List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {content.map((item) => (
          <div key={item.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${
            item.used ? 'border-green-400 bg-green-50' : 'border-amber-400'
          }`}>
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
              <div className="flex space-x-1">
                <button
                  onClick={() => setPreviewId(previewId === item.id ? null : item.id)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                  title="Preview"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleCopy(item)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                  title="Copy"
                >
                  {copiedId === item.id ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleEdit(item)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 text-gray-500 hover:text-red-600"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.content}</p>
            
            {item.field1 && (
              <p className="text-xs text-gray-500 mb-1">
                <strong>{currentTopic?.fields?.[0]}:</strong> {item.field1}
              </p>
            )}
            {item.field2 && (
              <p className="text-xs text-gray-500 mb-1">
                <strong>{currentTopic?.fields?.[1]}:</strong> {item.field2}
              </p>
            )}

            {item.tags && (
              <div className="flex flex-wrap gap-1 mb-2">
                {item.tags.split(',').map((tag, index) => (
                  <span key={index} className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mt-3">
              <button
                onClick={() => handleMarkUsed(item.id)}
                className={`text-xs px-2 py-1 rounded ${
                  item.used 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {item.used ? 'Used' : 'Mark Used'}
              </button>
              <span className="text-xs text-gray-400">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Preview Modal */}
            {previewId === item.id && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <button
                      onClick={() => setPreviewId(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <p className="text-gray-700">{item.content}</p>
                    {item.field1 && (
                      <p><strong>{currentTopic?.fields?.[0]}:</strong> {item.field1}</p>
                    )}
                    {item.field2 && (
                      <p><strong>{currentTopic?.fields?.[1]}:</strong> {item.field2}</p>
                    )}
                    {item.tags && (
                      <div>
                        <strong>Tags:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.tags.split(',').map((tag, index) => (
                            <span key={index} className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {item.url && (
                      <p>
                        <strong>URL:</strong>{' '}
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {item.url}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {content.length === 0 && (
        <div className="text-center py-12">
          <IconComponent className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No {currentTopic?.label || 'content'} yet</h3>
          <p className="text-gray-500 mb-4">Get started by adding your first {currentTopic?.label || 'content'} item.</p>
          <button
            onClick={() => setIsAdding(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add {currentTopic?.label || 'Content'}
          </button>
        </div>
      )}
    </div>
  );
}
