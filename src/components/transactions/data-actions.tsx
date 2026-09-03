'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Upload } from 'lucide-react'
import Papa from 'papaparse'
import { Dictionary } from '@/lib/i18n/dictionaries'
import { importTransactions } from '@/lib/actions/import'

export function DataActions({ dict, transactions, user }: { dict: Dictionary, transactions: any[], user: any }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importing, setImporting] = useState(false)

  if (!user) return null

  const handleExport = () => {
    if (!transactions || transactions.length === 0) return

    const exportData = transactions.map(tx => ({
      Date: tx.date,
      Type: tx.type,
      Category: tx.category,
      Amount: tx.amount,
      Description: tx.description || ''
    }))

    const csv = Papa.unparse(exportData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `cashcal-export-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        if (results.data && results.data.length > 0) {
          const count = results.data.length
          if (confirm(dict.data.confirmImport.replace('{count}', count.toString()))) {
            setImporting(true)
            try {
              const formattedData = results.data.map((row: any) => ({
                date: row.Date,
                type: row.Type,
                category: row.Category,
                amount: parseFloat(row.Amount),
                description: row.Description
              })).filter((tx: any) => !isNaN(tx.amount) && tx.date && tx.type && tx.category)
              
              await importTransactions(formattedData)
              alert(dict.data.importSuccess.replace('{count}', formattedData.length.toString()))
            } catch (err) {
              console.error(err)
              alert(dict.data.importError)
            } finally {
              setImporting(false)
            }
          }
        }
        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    })
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleExport} disabled={transactions.length === 0}>
        <Download className="h-4 w-4 mr-2" />
        {dict.data.export}
      </Button>
      
      <Button variant="outline" size="sm" onClick={handleImportClick} disabled={importing}>
        <Upload className="h-4 w-4 mr-2" />
        {importing ? '...' : dict.data.import}
      </Button>
      
      <input 
        type="file" 
        accept=".csv" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />
    </div>
  )
}
