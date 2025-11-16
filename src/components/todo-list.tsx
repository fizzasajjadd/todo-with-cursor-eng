'use client'

import { useState, useEffect } from 'react'
import { Check, Trash2, Edit2, Plus } from 'lucide-react'

interface Task {
  id: string
  title: string
  completed: boolean
}

interface SystemMessageProps {
  text: string
  type: string
}

// System Message Component
function SystemMessage({ text, type }: SystemMessageProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  const bgColor = {
    create: 'bg-blue-50 border-blue-200 text-blue-900',
    update: 'bg-amber-50 border-amber-200 text-amber-900',
    delete: 'bg-red-50 border-red-200 text-red-900',
    complete: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  }[type] || 'bg-slate-50 border-slate-200 text-slate-900'

  return (
    <div
      className={`mb-6 px-4 py-3 rounded-lg border ${bgColor} text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300`}
    >
      {text}
    </div>
  )
}

// Task Item Component
interface TaskItemProps {
  task: { id: string; title: string; completed: boolean }
  isEditing: boolean
  editText: string
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEditStart: (id: string, title: string) => void
  onEditSave: (id: string) => void
  onEditTextChange: (text: string) => void
}

function TaskItem({
  task,
  isEditing,
  editText,
  onToggle,
  onDelete,
  onEditStart,
  onEditSave,
  onEditTextChange,
}: TaskItemProps) {
  return (
    <div className="group flex items-center gap-4 px-5 py-4 rounded-lg border border-border/60 bg-card hover:border-border/80 hover:shadow-sm transition-all duration-200">
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
          task.completed
            ? 'bg-primary border-primary'
            : 'border-border hover:border-muted-foreground'
        }`}
      >
        {task.completed && <Check size={16} className="text-primary-foreground" />}
      </button>

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            autoFocus
            value={editText}
            onChange={(e) => onEditTextChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onEditSave(task.id)
              if (e.key === 'Escape') onEditStart(task.id, task.title)
            }}
            className="w-full px-2 py-1 bg-background border border-border/60 rounded text-sm text-foreground focus:outline-none focus:border-primary"
            placeholder="Edit task..."
          />
        ) : (
          <p
            className={`text-sm leading-relaxed transition-all ${
              task.completed
                ? 'text-muted-foreground line-through'
                : 'text-foreground'
            }`}
          >
            {task.title}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {isEditing ? (
          <button
            onClick={() => onEditSave(task.id)}
            className="p-2 hover:bg-muted rounded-md transition-colors text-foreground hover:text-primary"
            title="Save"
          >
            <Check size={18} />
          </button>
        ) : (
          <button
            onClick={() => onEditStart(task.id, task.title)}
            className="p-2 hover:bg-muted rounded-md transition-colors text-foreground hover:text-primary"
            title="Edit"
          >
            <Edit2 size={18} />
          </button>
        )}
        <button
          onClick={() => onDelete(task.id)}
          className="p-2 hover:bg-destructive/10 rounded-md transition-colors text-foreground hover:text-destructive"
          title="Delete"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  )
}

// Task Input Component
interface TaskInputProps {
  onAdd: (title: string) => void
}

function TaskInput({ onAdd }: TaskInputProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onAdd(input.trim())
      setInput('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1 px-4 py-3 rounded-lg border border-border/60 bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm"
      />
      <button
        type="submit"
        disabled={!input.trim()}
        className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
      >
        <Plus size={20} />
        <span className="hidden sm:inline">Add</span>
      </button>
    </form>
  )
}

// Main TodoList Component
export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Review quarterly reports', completed: false },
    { id: '2', title: 'Schedule team sync meeting', completed: true },
    { id: '3', title: 'Approve vendor contracts', completed: false },
  ])

  const [systemMessage, setSystemMessage] = useState<{ text: string; type: string } | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

  const showMessage = (text: string, type: string) => {
    setSystemMessage({ text, type })
    setTimeout(() => setSystemMessage(null), 3000)
  }

  const addTask = (title: string) => {
    setTasks([...tasks, { id: Date.now().toString(), title, completed: false }])
    showMessage('Logged. Try not to forget it this time.', 'create')
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
    const task = tasks.find(t => t.id === id)
    showMessage(task?.completed ? 'Logged. Try not to forget it this time.' : 'Completed. My faith in you rises slightly.', task?.completed ? 'create' : 'complete')
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
    showMessage('Gone. As if it never happened.', 'delete')
  }

  const startEdit = (id: string, title: string) => {
    setEditingId(id)
    setEditText(title)
  }

  const saveEdit = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, title: editText } : task
    ))
    setEditingId(null)
    showMessage('Polished. Much better.', 'update')
  }

  const completedCount = tasks.filter(t => t.completed).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/5">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">Operational To-Dos</h1>
          <p className="text-sm text-muted-foreground">
            {completedCount} of {tasks.length} completed
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* System Message */}
        {systemMessage && (
          <SystemMessage text={systemMessage.text} type={systemMessage.type} />
        )}

        {/* Input Section */}
        <div className="mb-8">
          <TaskInput onAdd={addTask} />
        </div>

        {/* Tasks List */}
        <div className="space-y-3 mb-12">
          {tasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">No tasks yet. Time to stay organized.</p>
            </div>
          ) : (
            tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                isEditing={editingId === task.id}
                editText={editText}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onEditStart={startEdit}
                onEditSave={saveEdit}
                onEditTextChange={setEditText}
              />
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm py-8 mt-12">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-xs text-muted-foreground italic">Built to keep the chaos in check.</p>
        </div>
      </footer>
    </div>
  )
}
