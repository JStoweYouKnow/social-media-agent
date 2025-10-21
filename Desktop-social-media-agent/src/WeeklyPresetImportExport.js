import { useState } from 'react';
import { Upload, Download } from 'lucide-react';

export default function WeeklyPresetImportExport({ presets, setPresets }) {
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  // Download all presets as JSON
  const downloadPresets = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(presets, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "weekly-presets.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Upload presets from JSON file
  const uploadPresets = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Clear previous messages
    setUploadError(null);
    setUploadSuccess(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const rawData = event.target.result;
        console.log('Raw file content:', rawData);

        const imported = JSON.parse(rawData);
        console.log('Parsed JSON:', imported);
        console.log('Type of imported:', typeof imported);
        console.log('Is array?', Array.isArray(imported));

        // Handle both array and single preset object
        let presetsToImport = [];
        if (Array.isArray(imported)) {
          presetsToImport = imported;
        } else if (imported && typeof imported === 'object') {
          // If it's a single preset object, wrap it in an array
          presetsToImport = [imported];
        } else {
          throw new Error(`Invalid format: expected array or object, got ${typeof imported}`);
        }

        console.log('Presets to import:', presetsToImport);

        // Validate preset structure
        const validPresets = presetsToImport.filter((preset, index) => {
          const isValid = preset &&
                 typeof preset === 'object' &&
                 preset.name &&
                 preset.schedule &&
                 typeof preset.schedule === 'object';

          if (!isValid) {
            console.log(`Invalid preset at index ${index}:`, preset);
          }
          return isValid;
        });

        console.log('Valid presets:', validPresets);

        if (validPresets.length === 0) {
          throw new Error('No valid presets found. Each preset must have a "name" and "schedule" object.');
        }

        // Assign new IDs if they don't exist
        const presetsWithIds = validPresets.map(preset => ({
          ...preset,
          id: preset.id || Date.now() + Math.random(),
          createdAt: preset.createdAt || new Date().toISOString()
        }));

        // Merge with existing presets (avoid duplicates by name)
        const existingNames = new Set(presets.map(p => p.name.toLowerCase()));
        const newPresets = presetsWithIds.filter(p => !existingNames.has(p.name.toLowerCase()));

        if (newPresets.length === 0) {
          setUploadError('All presets with these names already exist. Please rename them or delete existing presets first.');
          setUploadSuccess(null);
          return;
        }

        setPresets([...presets, ...newPresets]);
        setUploadSuccess(`Successfully imported ${newPresets.length} preset(s)!`);
        setUploadError(null);

        // Clear success message after 3 seconds
        setTimeout(() => setUploadSuccess(null), 3000);
      } catch (err) {
        console.error('Import error:', err);
        setUploadError('Failed to import: ' + err.message);
        setUploadSuccess(null);
        // Clear error message after 10 seconds to give user time to read
        setTimeout(() => setUploadError(null), 10000);
      }
    };

    reader.onerror = () => {
      setUploadError('Failed to read file. Please try again.');
      setUploadSuccess(null);
    };

    reader.readAsText(file);
    // Reset file input
    e.target.value = '';
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-center flex-wrap">
        <label className="flex items-center gap-2 cursor-pointer bg-amber-100 hover:bg-amber-200 text-amber-800 px-4 py-2 rounded-lg font-medium border border-amber-300 transition-colors">
          <Upload className="w-5 h-5" /> Import Presets
          <input type="file" accept="application/json,.json" onChange={uploadPresets} className="hidden" />
        </label>
        <button
          onClick={downloadPresets}
          disabled={presets.length === 0}
          className="flex items-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-800 px-4 py-2 rounded-lg font-medium border border-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={presets.length === 0 ? "No presets to export" : "Export all presets as JSON"}
        >
          <Download className="w-5 h-5" /> Export Presets
        </button>
        <span className="text-sm text-gray-600">
          ({presets.length} preset{presets.length !== 1 ? 's' : ''} saved)
        </span>
      </div>
      {uploadError && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-2 rounded-lg text-sm">
          <strong>Error:</strong> {uploadError}
        </div>
      )}
      {uploadSuccess && (
        <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-2 rounded-lg text-sm">
          <strong>Success:</strong> {uploadSuccess}
        </div>
      )}
    </div>
  );
}
