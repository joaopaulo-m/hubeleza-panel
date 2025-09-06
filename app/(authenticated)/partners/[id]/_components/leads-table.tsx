'use client'

import React, { useState, useMemo } from "react"
import { Search, User, Phone, MapPin, Calendar, Tag, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { formatCurrency } from "@/lib/utils"
import type { Lead } from "@/types/entities/lead"

interface LeadsTableProps {
  leads: Lead[]
}

export function LeadsTable({ leads }: LeadsTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  // Filtrar leads
  const filteredLeads = useMemo(() => {
    return leads
      .filter(lead => {
        if (!searchQuery) return true
        
        const query = searchQuery.toLowerCase()
        return (
          lead.name.toLowerCase().includes(query) ||
          lead.phone_number.includes(query) ||
          lead.cep.includes(query) ||
          lead.treatments.some(t => t.name.toLowerCase().includes(query))
        )
      })
      .sort((a, b) => b.created_at - a.created_at)
  }, [leads, searchQuery])

  // Agrupar leads por mês para estatísticas
  const leadsByMonth = useMemo(() => {
    const grouped = leads.reduce((acc, lead) => {
      const date = new Date(lead.created_at * 1000)
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!acc[month]) {
        acc[month] = []
      }
      acc[month].push(lead)
      
      return acc
    }, {} as Record<string, Lead[]>)
    
    return Object.entries(grouped)
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 6) // Últimos 6 meses
  }, [leads])

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total de Leads</p>
              <p className="text-2xl font-bold text-blue-700">{leads.length}</p>
            </div>
            <User className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Este Mês</p>
              <p className="text-2xl font-bold text-green-700">
                {leadsByMonth[0] ? leadsByMonth[0][1].length : 0}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Tratamentos Únicos</p>
              <p className="text-2xl font-bold text-purple-700">
                {new Set(leads.flatMap(l => l.treatments.map(t => t.id))).size}
              </p>
            </div>
            <Tag className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Média Mensal</p>
              <p className="text-2xl font-bold text-orange-700">
                {leadsByMonth.length > 0 
                  ? Math.round(leads.length / leadsByMonth.length)
                  : 0
                }
              </p>
            </div>
            <Calendar className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome, telefone, CEP ou tratamento..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Badge variant="outline" className="text-sm">
          {filteredLeads.length} de {leads.length} leads
        </Badge>
      </div>

      {/* Monthly Distribution */}
      {leadsByMonth.length > 0 && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Distribuição Mensal de Leads</h3>
          <div className="space-y-2">
            {leadsByMonth.map(([month, monthLeads]) => {
              const [year, monthNum] = month.split('-')
              const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
              
              return (
                <div key={month} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <span className="text-sm capitalize">{monthName}</span>
                  <Badge variant="outline">{monthLeads.length} leads</Badge>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}