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
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);

        // Handle both array and single preset object
        let presetsToImport = [];
        if (Array.isArray(imported)) {
          presetsToImport = imported;
        } else if (imported && typeof imported === 'object') {
          // If it's a single preset object, wrap it in an array
          presetsToImport = [imported];
        } else {
          throw new Error('Invalid format: expected array or object');
        }

        // Validate preset structure
        const validPresets = presetsToImport.filter(preset => {
          return preset &&
                 preset.name &&
                 preset.schedule &&
                 typeof preset.schedule === 'object';
        });

        if (validPresets.length === 0) {
          throw new Error('No valid presets found in file');
        }

        // Merge with existing presets (avoid duplicates by ID)
        const existingIds = new Set(presets.map(p => p.id));
        const newPresets = validPresets.filter(p => !existingIds.has(p.id));

        if (newPresets.length === 0) {
          setUploadError('All presets already exist');
          setUploadSuccess(null);
          return;
        }

        setPresets([...presets, ...newPresets]);
        setUploadSuccess(`${newPresets.length} preset(s) imported successfully!`);
        setUploadError(null);

        // Clear success message after 3 seconds
        setTimeout(() => setUploadSuccess(null), 3000);
      } catch (err) {
        setUploadError('Failed to import: ' + err.message);
        setUploadSuccess(null);
        // Clear error message after 5 seconds
        setTimeout(() => setUploadError(null), 5000);
      }
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
