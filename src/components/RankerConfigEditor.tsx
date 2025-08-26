'use client'
import { useRankerConfigStore } from '../store/rankerConfigStore'
import { useState } from 'react'
import toast from 'react-hot-toast'
import clsx from 'clsx'

export default function RankerConfigEditor() {
  const { config, updateConfig, saveConfig } = useRankerConfigStore()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateField = (key: string, value: string) => {
    if (!value.trim()) return 'This field is required.'
    if (key === 'Durations') {
      const parts = value.split(',').map(p => p.trim())
      if (parts.some(p => isNaN(Number(p)))) return 'Must be a comma-separated list of numbers.'
    } else if (!isNaN(Number(config[key as keyof typeof config]))) {
      if (isNaN(Number(value))) return 'Must be a number.'
    }
    return ''
  }

  const handleBlur = (key: keyof typeof config, rawValue: string) => {
    const error = validateField(key, rawValue)
    setErrors(prev => ({ ...prev, [key]: error }))
    if (error) return

    const parsed = key === 'Durations'
      ? rawValue.split(',').map(Number)
      : isNaN(Number(rawValue)) ? rawValue : Number(rawValue)

    updateConfig(key, parsed)
  }

  const handleSave = async () => {
    const hasErrors = Object.values(errors).some(e => e)
    if (hasErrors) {
      toast.error('Please fix validation errors before saving.')
      return
    }

    toast.promise(saveConfig(), {
      loading: 'Saving...',
      success: 'Config saved successfully!',
      error: 'Failed to save config.',
    })
  }

  return (
    <div className="p-6 bg-zinc-900 rounded-lg text-white max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Ranker Config Editor</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(config).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <label htmlFor={key} className="block text-sm font-medium text-gray-300">
              {key}
            </label>
            <input
              id={key}
              type="text"
              defaultValue={Array.isArray(value) ? value.join(',') : value}
              onBlur={(e) => handleBlur(key as keyof typeof config, e.target.value)}
              className={clsx(
                'w-full px-3 py-2 bg-zinc-800 text-white border rounded',
                errors[key] ? 'border-red-500' : 'border-zinc-700'
              )}
            />
            {errors[key] && (
              <p className="text-red-400 text-sm">{errors[key]}</p>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={handleSave}
        className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white transition-all"
      >
        Save Changes
      </button>
    </div>
  )
}
