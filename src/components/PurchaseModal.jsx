import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { formatCurrency } from '../utils/formatters'
import { createPurchase } from '../services/purchaseService'
import { useAuth } from '../hooks/useAuth'

const PurchaseModal = ({ isOpen, onClose, course, onPurchaseComplete }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handlePurchase = async () => {
    if (!user) {
      setError('Please log in to purchase courses')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { purchase, error: purchaseError } = await createPurchase(
        user.id,
        course.id,
        { amount: course.price }
      )

      if (purchaseError) {
        throw purchaseError
      }

      // Callback to parent
      if (onPurchaseComplete) {
        onPurchaseComplete(purchase)
      }

      onClose()
    } catch (err) {
      console.error('Purchase error:', err)
      setError(err.message || 'Failed to complete purchase. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-bold leading-6 text-gray-900 dark:text-gray-100 mb-4"
                >
                  Purchase Course
                </Dialog.Title>

                {course && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {course.title}
                    </h4>
                    <p className="text-muted text-sm mb-4">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-muted">Total Price</span>
                      <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {formatCurrency(course.price)}
                      </span>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    type="button"
                    className="flex-1 btn-secondary"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="flex-1 btn-primary"
                    onClick={handlePurchase}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Confirm Purchase'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default PurchaseModal

