// components/Modal.tsx
'use client'
import { useModalStore } from '../store/modalStore'
import { useEffect } from 'react'

const Modal = () => {
  const { isOpen, component, closeModal } = useModalStore()

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && closeModal()
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [closeModal])

  if (!isOpen || !component) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white max-w-screen-lg w-full max-h-[90vh] p-4 rounded shadow relative overflow-y-auto">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-700 hover:text-red-600 text-xl"
        >
          ✕
        </button>
        {component}
      </div>
    </div>
  )
}

export default Modal
