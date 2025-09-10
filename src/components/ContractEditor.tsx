'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sparkles,
  RefreshCw,
  Type
} from 'lucide-react'

interface ContractEditorProps {
  content: string
  onChange: (content: string) => void
  onAIAssist?: () => void
  placeholder?: string
  className?: string
  isGenerating?: boolean
  generationProgress?: string
}

export default function ContractEditor({ 
  content, 
  onChange, 
  onAIAssist,
  placeholder = "Start typing your contract content...",
  className = "",
  isGenerating = false,
  generationProgress = ""
}: ContractEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
    ],
    content: content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[300px] p-6 text-neutral-800',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-64 bg-white/60 backdrop-blur-sm rounded-2xl border border-neutral-200/60">
        <div className="flex items-center gap-3 text-neutral-600">
          <RefreshCw className="animate-spin" size={20} />
          <span className="text-sm font-medium">Loading editor...</span>
        </div>
      </div>
    )
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    children, 
    title 
  }: { 
    onClick: () => void
    isActive?: boolean
    children: React.ReactNode
    title: string
  }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      title={title}
      className={`p-3 rounded-xl transition-all duration-200 ${
        isActive 
          ? 'bg-primary-500 text-white shadow-glow' 
          : 'bg-white/80 text-neutral-600 hover:bg-primary-50 hover:text-primary-700 border border-neutral-200/60'
      }`}
    >
      {children}
    </motion.button>
  )

  return (
    <div className={`bg-white/60 backdrop-blur-sm rounded-2xl border border-neutral-200/60 overflow-hidden shadow-medium ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-neutral-200/60 p-4 bg-white/40 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Text Formatting */}
          <div className="flex items-center gap-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              title="Bold"
            >
              <Bold size={16} />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              title="Italic"
            >
              <Italic size={16} />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive('strike')}
              title="Strikethrough"
            >
              <UnderlineIcon size={16} />
            </ToolbarButton>
          </div>

          <div className="w-px h-8 bg-neutral-200/60" />

          {/* Lists */}
          <div className="flex items-center gap-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              title="Bullet List"
            >
              <List size={16} />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              title="Numbered List"
            >
              <ListOrdered size={16} />
            </ToolbarButton>
          </div>

          <div className="w-px h-8 bg-neutral-200/60" />

          {/* Headings */}
          <div className="flex items-center gap-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive('heading', { level: 1 })}
              title="Heading 1"
            >
              <Type size={16} />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive('heading', { level: 2 })}
              title="Heading 2"
            >
              <Type size={14} />
            </ToolbarButton>
          </div>

          {/* AI Assist */}
          {onAIAssist && (
            <>
              <div className="w-px h-8 bg-neutral-200/60" />
              <motion.button
                whileHover={!isGenerating ? { scale: 1.05 } : {}}
                whileTap={!isGenerating ? { scale: 0.95 } : {}}
                onClick={onAIAssist}
                disabled={isGenerating}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-medium ${
                  isGenerating
                    ? 'bg-neutral-400 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-500 to-coral-500 text-white hover:from-primary-600 hover:to-coral-600'
                }`}
                title={isGenerating ? generationProgress : "AI Assist"}
              >
                {isGenerating ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <Sparkles size={16} />
                )}
                {isGenerating ? 'Generating...' : 'AI Assist'}
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="relative bg-white/40 backdrop-blur-sm">
        <EditorContent 
          editor={editor} 
          className="min-h-[300px] max-h-[500px] overflow-y-auto"
        />
        {editor.isEmpty && !isGenerating && (
          <div className="absolute top-6 left-6 text-neutral-400 pointer-events-none text-sm">
            {placeholder}
          </div>
        )}
        {isGenerating && generationProgress && (
          <div className="absolute top-6 right-6 flex items-center gap-2 bg-primary-50 text-primary-700 px-3 py-2 rounded-lg text-sm font-medium shadow-soft">
            <RefreshCw size={14} className="animate-spin" />
            {generationProgress}
          </div>
        )}
      </div>

      {/* Footer with character count */}
      <div className="border-t border-neutral-200/60 p-3 px-6 bg-white/40 backdrop-blur-sm">
        <div className="flex justify-between items-center text-xs text-neutral-500">
          <span>Rich text editor</span>
          <span>
            {editor.storage.characterCount?.characters() || editor.getText().length} characters
          </span>
        </div>
      </div>
    </div>
  )
}