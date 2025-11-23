import { useState, useRef, ChangeEvent } from 'react'
import './MarkdownEditor.css'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onImageUpload?: (file: File) => void
  minRows?: number
}

function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Write your notes in markdown...',
  onImageUpload,
  minRows = 6,
}: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Insert markdown formatting at cursor
  const insertMarkdown = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const textToInsert = selectedText || placeholder

    const newValue =
      value.substring(0, start) +
      before +
      textToInsert +
      after +
      value.substring(end)

    onChange(newValue)

    // Set cursor position after insertion
    setTimeout(() => {
      const newCursorPos = start + before.length + textToInsert.length
      textarea.focus()
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  // Toolbar actions
  const formatBold = () => insertMarkdown('**', '**', 'bold text')
  const formatItalic = () => insertMarkdown('*', '*', 'italic text')
  const formatHeading = () => insertMarkdown('## ', '', 'Heading')
  const formatCode = () => insertMarkdown('`', '`', 'code')
  const formatCodeBlock = () => insertMarkdown('```\n', '\n```', 'code block')
  const formatList = () => insertMarkdown('- ', '', 'list item')
  const formatNumberedList = () => insertMarkdown('1. ', '', 'list item')
  const formatQuote = () => insertMarkdown('> ', '', 'quote')
  const formatLink = () => insertMarkdown('[', '](url)', 'link text')

  // Handle image upload
  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onImageUpload) {
      // Check if it's an image
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB')
        return
      }

      onImageUpload(file)
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Simple markdown to HTML conversion for preview
  const renderMarkdown = (text: string) => {
    let html = text

    // Escape HTML
    html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

    // Code blocks
    html = html.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>')

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
    html = html.replace(/^## (.*$)/gim, '<h3>$1</h3>')
    html = html.replace(/^# (.*$)/gim, '<h3>$1</h3>')

    // Bold
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')

    // Italic
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')

    // Lists
    html = html.replace(/^\- (.*)$/gim, '<li>$1</li>')
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')

    html = html.replace(/^\d+\. (.*)$/gim, '<li>$1</li>')

    // Blockquotes
    html = html.replace(/^&gt; (.*)$/gim, '<blockquote>$1</blockquote>')

    // Line breaks
    html = html.replace(/\n/g, '<br>')

    return html
  }

  return (
    <div className="markdown-editor">
      {/* Toolbar */}
      <div className="markdown-toolbar">
        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-button"
            onClick={formatBold}
            title="Bold (Ctrl+B)"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            className="toolbar-button"
            onClick={formatItalic}
            title="Italic (Ctrl+I)"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            className="toolbar-button"
            onClick={formatHeading}
            title="Heading"
          >
            H
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-button"
            onClick={formatCode}
            title="Inline Code"
          >
            {'</>'}
          </button>
          <button
            type="button"
            className="toolbar-button"
            onClick={formatCodeBlock}
            title="Code Block"
          >
            {'{}'}
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-button"
            onClick={formatList}
            title="Bullet List"
          >
            • List
          </button>
          <button
            type="button"
            className="toolbar-button"
            onClick={formatNumberedList}
            title="Numbered List"
          >
            1. List
          </button>
          <button
            type="button"
            className="toolbar-button"
            onClick={formatQuote}
            title="Quote"
          >
            " Quote
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-button"
            onClick={formatLink}
            title="Link"
          >
            🔗
          </button>
          {onImageUpload && (
            <button
              type="button"
              className="toolbar-button"
              onClick={handleImageClick}
              title="Upload Image"
            >
              📷
            </button>
          )}
        </div>

        <div className="toolbar-group toolbar-right">
          <button
            type="button"
            className={`toolbar-button ${showPreview ? 'active' : ''}`}
            onClick={() => setShowPreview(!showPreview)}
            title="Toggle Preview"
          >
            👁 {showPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Editor/Preview */}
      <div className="markdown-content">
        {showPreview ? (
          <div
            className="markdown-preview"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="markdown-textarea"
            rows={minRows}
          />
        )}
      </div>

      {/* Help text */}
      <div className="markdown-help">
        <span>Supports: **bold**, *italic*, ## headings, `code`, - lists, [links](url)</span>
      </div>
    </div>
  )
}

export default MarkdownEditor
