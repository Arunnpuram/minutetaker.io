import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import templates from './templates'; // Assuming templates is an array with { name, content }

const App = () => {
  const [minutes, setMinutes] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [hoveredTemplate, setHoveredTemplate] = useState(null); // State to handle hover

  // Export as PDF
  const exportAsPdf = () => {
    const doc = new jsPDF();
    doc.text(minutes, 10, 10);
    const today = new Date().toISOString().split('T')[0];
    doc.save(`meeting_minutes_${today}.pdf`);
  };

  // Export as DOCX
  const exportAsDocx = () => {
    const docxBlob = new Blob([minutes], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    const today = new Date().toISOString().split('T')[0];
    saveAs(docxBlob, `meeting_minutes_${today}.docx`);
  };

  // Handle template selection
  const handleTemplateSelect = (templateContent) => {
    setMinutes(templateContent);
    setHoveredTemplate(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="flex justify-between items-center p-5 bg-gray-800">
        <h1 className="text-3xl font-bold text-center mb-8">minutetaker.io</h1>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-center mb-8">Create Your Meeting Minutes</h2>

        {/* Template Selector */}
        <div className="relative mb-6">
          <label className="block text-gray-400 mb-2">Select a Template:</label>
          <select
            className="w-full p-2 bg-gray-800 text-white rounded-lg"
            value={selectedTemplate}
            onChange={(e) => {
              const selected = templates.find((t) => t.name === e.target.value);
              setSelectedTemplate(e.target.value);
              if (selected) handleTemplateSelect(selected.content);
            }}
            onMouseLeave={() => setHoveredTemplate(null)} // Hide preview on mouse leave
          >
            <option value="" disabled>
              - Choose a Template -
            </option>
            {templates.map((template) => (
              <option
                key={template.name}
                value={template.name}
                onMouseEnter={() => setHoveredTemplate(template)} // Show preview on hover
              >
                {template.name}
              </option>
            ))}
          </select>

          {/* Template Preview Popup */}
          {hoveredTemplate && (
            <div
              className="absolute bg-gray-800 text-white p-4 rounded-lg shadow-lg mt-2 w-80 z-10 left-0 top-12"
              style={{ maxWidth: '300px', wordWrap: 'break-word' }}
            >
              <h3 className="text-lg font-semibold">{hoveredTemplate.name}</h3>
              <p className="text-sm text-gray-400 mt-2">
                {hoveredTemplate.content.slice(0, 100)}...
              </p>
            </div>
          )}
        </div>

        {/* Text Editor */}
        <textarea
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          placeholder="Type your minutes here..."
          className="w-full h-72 p-4 text-lg bg-gray-800 text-white border border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
        />

        {/* Buttons */}
        <div className="flex justify-center gap-6 mt-6">
          <button
            onClick={exportAsPdf}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg shadow-md transition duration-200"
          >
            Export as PDF
          </button>
          <button
            onClick={exportAsDocx}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg shadow-md transition duration-200"
          >
            Export as DOCX
          </button>
        </div>
      </main>

      <footer className="text-center py-4 bg-gray-800 text-gray-400">
        <p>© 2024 minutetaker.io - All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default App;
