import React, { useState } from "react";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph } from "docx";
import { saveAs } from "file-saver";

const Editor = () => {
  const [content, setContent] = useState("");

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(content, 10, 10);
    doc.save("MeetingMinutes.pdf");
  };

  const exportToDOCX = () => {
    const doc = new Document({
      sections: [
        {
          children: [new Paragraph(content)],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "MeetingMinutes.docx");
    });
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
      <textarea
        className="w-full h-64 bg-gray-900 text-gray-100 p-4 rounded-md border border-gray-700 focus:outline-none"
        placeholder="Type your minutes here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <div className="flex gap-4 mt-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={exportToPDF}
        >
          Export as PDF
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={exportToDOCX}
        >
          Export as DOCX
        </button>
      </div>
    </div>
  );
};

export default Editor;
