import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IconChevronUp, IconChevronDown } from "@tabler/icons-react"
import { Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  render?: (row: any) => React.ReactNode
}

export interface CustomTableProps {
  data: any[]
  columns: TableColumn[]
  sortable?: boolean
  pagination?: boolean
  pageSize?: number
  onEdit?: (row: any) => void
  onDelete?: (row: any) => void
}

export function CustomTable({
  data,
  columns,
  sortable = false,
  pagination = false,
  pageSize = 10,
  onEdit,
  onDelete,
}: CustomTableProps) {
  const [sortKey, setSortKey] = React.useState<string | null>(null)
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = React.useState(1)

  const handleSort = (colKey: string) => {
    if (!sortable) return
    if (sortKey === colKey) {
      if (sortDir === "asc") setSortDir("desc")
      else setSortKey(null)
    } else {
      setSortKey(colKey)
      setSortDir("asc")
    }
  }

  const sortedData = React.useMemo(() => {
    if (!sortKey) return data
    return [...data].sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortDir === "asc" ? -1 : 1
      if (a[sortKey] > b[sortKey]) return sortDir === "asc" ? 1 : -1
      return 0
    })
  }, [data, sortKey, sortDir])

  const totalPages = Math.ceil(sortedData.length / pageSize)
  const displayData = pagination
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedData

  const hasActions = !!onEdit || !!onDelete

  return (
    <div className="w-full flex justify-start flex-col gap-4">
      <div className="overflow-hidden rounded-3xl border border-white/5 bg-[#1c1c1e]">
        <table className="w-full text-sm text-left align-middle border-collapse h-px table-auto">
          <thead className="bg-[#D3FF33] border-b border-[#D3FF33]/20 text-black uppercase text-xs">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() =>
                    (sortable && col.sortable !== false) ? handleSort(col.key) : undefined
                  }
                  className={`p-4 font-medium tracking-wider select-none ${
                    sortable && col.sortable !== false ? "cursor-pointer hover:bg-white/10" : ""
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortKey === col.key && (
                      sortDir === "asc" ? <IconChevronUp className="w-3 h-3" /> : <IconChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
              ))}
              {hasActions && (
                <th className="p-4 font-medium text-right tracking-wider">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="wait">
              {displayData.map((row) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="py-5 px-4">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(row)}
                            className="h-8 w-8 bg-transparent text-gray-500 hover:text-blue-400 hover:bg-transparent"
                          >
                            <Edit2 className="w-4 h-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(row)}
                            className="h-8 w-8 bg-transparent text-gray-500 hover:text-red-400 hover:bg-transparent"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </AnimatePresence>
            {displayData.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="p-8 text-center text-muted-foreground"
                >
                  No records to display.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 border-white/10 text-xs"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 border-white/10 text-xs"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
