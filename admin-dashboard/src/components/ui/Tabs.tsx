import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsContextType {
  activeTab: string
  setActiveTab: (value: string) => void
}
const TabsContext = React.createContext<TabsContextType | undefined>(undefined)

interface TabsProps {
  defaultValue: string
  className?: string
  children: React.ReactNode
}

const Tabs: React.FC<TabsProps> = ({ defaultValue, className, children }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue)
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  )
}

const TabsList: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("flex border-b border-slate-200", className)} {...props} />
)

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}
const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, className, children, ...props }) => {
  const ctx = React.useContext(TabsContext)
  if (!ctx) throw new Error("TabsTrigger must be used within Tabs")
  const { activeTab, setActiveTab } = ctx
  return (
    <button
      className={cn(
        "px-4 py-2 text-sm font-medium border-b-2 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        activeTab === value
          ? "border-blue-600 text-blue-600"
          : "text-slate-600 hover:text-slate-900",
        className
      )}
      data-value={value}
      onClick={() => setActiveTab(value)}
      {...props}
    >
      {children}
    </button>
  )
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}
const TabsContent: React.FC<TabsContentProps> = ({ value, className, children, ...props }) => {
  const ctx = React.useContext(TabsContext)
  if (!ctx) throw new Error("TabsContent must be used within Tabs")
  const { activeTab } = ctx
  if (activeTab !== value) return null
  return (
    <div className={cn("mt-4", className)} data-value={value} {...props}>
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }