"use client"

import React, { useState, useMemo } from "react"
import { Search, Filter, TrendingUp, TrendingDown, Calendar, Eye } from "lucide-react"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { formatCurrency, cn } from "@/lib/utils"
import type { Transaction } from "@/types/entities/transaction"

interface TransactionsTableProps {
  transactions: Transaction[]
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  // Filtrar e ordenar transações
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(transaction => {
        const matchesSearch = !searchQuery || 
          transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (transaction.lead?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
        
        const matchesType = typeFilter === "all" || transaction.type === typeFilter
        const matchesStatus = statusFilter === "all" || transaction.status === statusFilter
        
        return matchesSearch && matchesType && matchesStatus
      })
      .sort((a, b) => b.created_at - a.created_at)
  }, [transactions, searchQuery, typeFilter, statusFilter])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return "bg-green-50 text-green-700 border-green-200"
      case 'pending': return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case 'failed': return "bg-red-50 text-red-700 border-red-200"
      default: return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getTypeColor = (type: string) => {
    return type === 'INCOME' 
      ? "text-green-600" 
      : "text-red-600"
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por ID ou nome do lead..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="INCOME">Créditos</SelectItem>
            <SelectItem value="EXPENSE">Débitos</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="PAID">Pagas</SelectItem>
            <SelectItem value="PENDING_PAYMENT">Pendente</SelectItem>
            <SelectItem value="RECEIVED">Cobradas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {filteredTransactions.length} de {transactions.length} transações
        </p>
        <Badge variant="outline" className="text-xs">
          Total: {formatCurrency(
            filteredTransactions.reduce((sum, t) => 
              sum + (t.type === 'INCOME' ? (t.amount + (t.bonus_amount || 0)) : -t.amount), 0
            )
          )}
        </Badge>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data/Hora</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Calendar className="w-8 h-8 text-gray-400" />
                    <p className="text-gray-500">Nenhuma transação encontrada</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(transaction.created_at).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.created_at).toLocaleTimeString('pt-BR')}
                      </p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {transaction.type === 'INCOME' ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-sm font-medium">
                        {transaction.type === 'INCOME' ? 'Crédito' : 'Débito'}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      {transaction.lead ? (
                        <>
                          <p className="text-sm font-medium">Compra de Lead</p>
                          <p className="text-xs text-gray-500">{transaction.lead.name}</p>
                        </>
                      ) : (
                        <p className="text-sm">
                          {transaction.type === 'INCOME' ? 'Recarga de wallet' : 'Débito da wallet'}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant="outline" className={cn("text-xs", getStatusColor(transaction.status))}>
                      {transaction.status === 'completed' ? 'Concluído' : 
                       transaction.status === 'pending' ? 'Pendente' : 
                       transaction.status === 'failed' ? 'Falhou' : transaction.status}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <span className={cn("font-bold", getTypeColor(transaction.type))}>
                      {transaction.type === 'INCOME' ? '+' : '-'}
                      {formatCurrency(transaction.amount + (transaction.bonus_amount || 0))}
                    </span>
                    {transaction.lead_price && (
                      <p className="text-xs text-gray-500">
                        Preço: {formatCurrency(transaction.lead_price)}
                      </p>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedTransaction(transaction)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Detalhes da Transação</DialogTitle>
                          <DialogDescription>
                            Informações completas da transação #{transaction.id.slice(0, 8)}
                          </DialogDescription>
                        </DialogHeader>
                        {selectedTransaction && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-500">ID da Transação</label>
                                <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1">
                                  {selectedTransaction.id}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Data/Hora</label>
                                <p className="text-sm mt-1">
                                  {new Date(selectedTransaction.created_at).toLocaleString('pt-BR')}
                                </p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-500">Tipo</label>
                                <Badge className={cn("mt-1", getTypeColor(selectedTransaction.type))}>
                                  {selectedTransaction.type === 'INCOME' ? 'Crédito' : 'Débito'}
                                </Badge>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Status</label>
                                <Badge variant="outline" className={cn("mt-1", getStatusColor(selectedTransaction.status))}>
                                  {selectedTransaction.status}
                                </Badge>
                              </div>
                            </div>

                            <div>
                              <label className="text-sm font-medium text-gray-500">Valor</label>
                              <p className={cn("text-2xl font-bold mt-1", getTypeColor(selectedTransaction.type))}>
                                {selectedTransaction.type === 'INCOME' ? '+' : '-'}
                                {formatCurrency(selectedTransaction.amount + (selectedTransaction.bonus_amount || 0))}
                              </p>
                            </div>

                            {selectedTransaction.lead && (
                              <div>
                                <label className="text-sm font-medium text-gray-500">Informações do Lead</label>
                                <div className="bg-gray-50 p-3 rounded-lg mt-1">
                                  <p className="font-medium">{selectedTransaction.lead.name}</p>
                                  <p className="text-sm text-gray-600">{selectedTransaction.lead.phone_number}</p>
                                  <p className="text-sm text-gray-600">{selectedTransaction.lead.cep}</p>
                                  {selectedTransaction.lead_price && (
                                    <p className="text-sm font-medium text-green-600 mt-1">
                                      Preço pago: {formatCurrency(selectedTransaction.lead_price)}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination could be added here if needed */}
    </div>
  )
}