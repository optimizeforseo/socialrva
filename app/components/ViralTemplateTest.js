"use client";

import { useState } from "react";
import ViralTemplateModal from "./ViralTemplateModal";

export default function ViralTemplateTest() {
  const [showModal, setShowModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    console.log("Selected template:", template);
  };

  return (
    <div className="p-6 bg-slate-800 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-4">
        Viral Template Test
      </h3>

      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
      >
        Open Viral Templates
      </button>

      {selectedTemplate && (
        <div className="mt-4 p-4 bg-slate-700 rounded-lg">
          <h4 className="text-white font-medium mb-2">Selected Template:</h4>
          <div className="text-sm text-gray-300">
            <p>
              <strong>Author:</strong> {selectedTemplate.author}
            </p>
            <p>
              <strong>Engagement:</strong>{" "}
              {selectedTemplate.engagement.reactions} reactions
            </p>
            <p>
              <strong>Content:</strong>{" "}
              {selectedTemplate.content.substring(0, 100)}...
            </p>
          </div>
        </div>
      )}

      <ViralTemplateModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelectTemplate={handleTemplateSelect}
      />
    </div>
  );
}
