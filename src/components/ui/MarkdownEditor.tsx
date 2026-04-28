"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      {/* 工具栏 */}
      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 flex justify-between items-center border-b border-gray-300 dark:border-gray-600">
        <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
          Markdown 编辑器
        </span>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {showPreview ? "编辑" : "预览"}
        </button>
      </div>

      {/* 编辑器/预览区 */}
      <div className={`${showPreview ? "grid grid-cols-2" : ""}`}>
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full min-h-[500px] p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none font-mono text-sm"
          placeholder="使用 Markdown 格式编写文章内容..."
        />
        
        {showPreview && (
          <div className="p-4 overflow-auto border-l border-gray-300 dark:border-gray-600 prose dark:prose-invert max-w-none">
            <ReactMarkdown>{value}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}