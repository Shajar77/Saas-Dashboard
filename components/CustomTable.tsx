import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IconChevronUp, IconChevronDown, IconEdit, IconTrash } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
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
      <div className="overflow-hidden rounded-lg border border-white/10 bg-black/20 backdrop-blur-md">
        <table className="w-full text-sm text-left align-middle border-collapse h-px table-auto">
          <thead className="bg-white/5 border-b border-white/10 text-muted-foreground uppercase text-xs">
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
            <AnimatePresence mode="popLayout">
              {displayData.map((row, index) => (
                <motion.tr
                  key={row.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="p-4">
                      {row[col.key]}
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
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <IconEdit className="w-4 h-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(row)}
                            className="h-8 w-8 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10"
                          >
                            <IconTrash className="w-4 h-4" />
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
