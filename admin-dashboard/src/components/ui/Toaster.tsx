// toaster.tsx
import { cn } from "@/lib/utils"
import { Check, AlertCircle, Info, X } from "lucide-react"
import { useToast } from "./Use-toast"
import { ToastProvider } from "./Use-toast"

const ToastContainer = () => {
  const { toasts, removeToast } = useToast()

  if (!toasts.length) return null

  const iconMap = {
    default: <Info className="h-5 w-5" />,
    success: <Check className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5" />,
    warning: <AlertCircle className="h-5 w-5" />,
  }

  const bgColorMap = {
    default: "bg-white",
    success: "bg-green-100",
    error: "bg-red-100",
    warning: "bg-yellow-100",
  }

  const textColorMap = {
    default: "text-slate-800",
    success: "text-green-800",
    error: "text-red-800",
    warning: "text-yellow-800",
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center w-full max-w-xs p-4 rounded-lg shadow-lg",
            bgColorMap[toast.type],
            textColorMap[toast.type]
          )}
        >
          <div className="mr-2">
            {iconMap[toast.type]}
          </div>
          <div className="text-sm font-medium flex-grow">
            {toast.message}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 text-slate-500 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

export { ToastProvider, ToastContainer }