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
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1c1c1e]/80 backdrop-blur-md shadow-xl">
        <table className="w-full text-sm text-left align-middle border-collapse h-px table-auto">
          <thead className="bg-gradient-to-r from-[#D3FF33] to-[#b8e62c] border-b border-white/10 text-black uppercase text-xs">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.key}
                  onClick={() =>
                    (sortable && col.sortable !== false) ? handleSort(col.key) : undefined
                  }
                  className={`p-2 md:p-4 font-bold tracking-wider select-none ${
                    sortable && col.sortable !== false ? "cursor-pointer hover:bg-white/10" : ""
                  } ${col.key === 'id' ? 'hidden md:table-cell w-12' : ''} ${col.key === 'category' ? 'hidden sm:table-cell' : ''} ${col.key === 'status' ? 'hidden lg:table-cell' : ''}`}
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
                <th className="p-2 md:p-4 font-bold text-right tracking-wider">
                  Actions
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
                  className="border-b border-white/5 hover:bg-white/[0.03] transition-all duration-200"
                >
                  {columns.map((col) => (
                    <td 
                      key={col.key} 
                      className={`py-3 px-2 md:py-5 md:px-4 ${col.key === 'id' ? 'hidden md:table-cell' : ''} ${col.key === 'category' ? 'hidden sm:table-cell' : ''} ${col.key === 'status' ? 'hidden lg:table-cell' : ''} ${col.key === 'name' ? 'max-w-[120px] lg:max-w-none truncate' : ''}`}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="p-2 md:p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="h-7 w-7 md:h-8 md:w-8 rounded-md bg-white/5 border border-white/10 text-gray-400 hover:text-[#D3FF33] hover:border-[#D3FF33]/30 hover:bg-[#D3FF33]/10 transition-all duration-200 flex items-center justify-center"
                          >
                            <Edit2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="h-7 w-7 md:h-8 md:w-8 rounded-md bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/10 transition-all duration-200 flex items-center justify-center"
                          >
                            <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          </button>
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
                  className="p-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>No records to display</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-3 md:px-4 py-2.5 md:py-3 bg-[#1c1c1e]/60 border border-white/10 rounded-xl backdrop-blur-sm">
          <div className="text-xs text-gray-400 font-medium">
            <span className="text-white">{currentPage}</span>
            <span className="mx-1">/</span>
            <span className="text-white">{totalPages}</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-7 md:h-8 w-7 md:w-8 md:px-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-7 md:h-8 w-7 md:w-8 md:px-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
