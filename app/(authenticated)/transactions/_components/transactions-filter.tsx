'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn, formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, X, Search, Filter } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { CurrencyInput } from '@/components/ui/currency-input';

export function TransactionsFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [partnerNameQuery, setPartnerNameQuery] = useState('');
  const [leadNameQuery, setLeadNameQuery] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [minAmount, setMinAmount] = useState(0);
  const [maxAmount, setMaxAmount] = useState(0);
  
  // Debounce para buscas por nome e valores
  const debouncedPartnerNameQuery = useDebounce(partnerNameQuery, 500);
  const debouncedLeadNameQuery = useDebounce(leadNameQuery, 500);
  const debouncedMinAmount = useDebounce<number>(minAmount, 500);
  const debouncedMaxAmount = useDebounce<number>(maxAmount, 500);

  // Initialize filters from URL params
  useEffect(() => {
    const startParam = searchParams.get('startDate');
    const endParam = searchParams.get('endDate');
    const partnerNameParam = searchParams.get('partnerName');
    const leadNameParam = searchParams.get('leadName');
    const typeParam = searchParams.get('type');
    const statusParam = searchParams.get('status');
    const minAmountParam = searchParams.get('minAmount');
    const maxAmountParam = searchParams.get('maxAmount');
    
    if (startParam) setStartDate(new Date(parseInt(startParam)));
    if (endParam) setEndDate(new Date(parseInt(endParam)));
    if (partnerNameParam) setPartnerNameQuery(partnerNameParam);
    if (leadNameParam) setLeadNameQuery(leadNameParam);
    if (typeParam) setType(typeParam);
    if (statusParam) setStatus(statusParam);
    if (minAmountParam) setMinAmount(Number(minAmountParam));
    if (maxAmountParam) setMaxAmount(Number(maxAmountParam));
  }, [searchParams]);

  // Function to update URL with current filters
  const updateURL = useCallback((updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams);
    
    // Apply updates
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Always reset to page 1 when filters change
    params.delete('page');
    
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  // Handle start date change
  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    updateURL({
      startDate: date ? date.getTime().toString() : undefined
    });
  };

  // Handle end date change
  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    updateURL({
      endDate: date ? (() => {
        if (!date) return undefined;
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        return endOfDay.getTime().toString();
      })() : undefined
    });
  };

  // Handle select changes
  const handleTypeChange = (value: string) => {
    const newType = value === 'all' ? '' : value;
    setType(newType);
    updateURL({ type: newType || undefined });
  };

  const handleStatusChange = (value: string) => {
    const newStatus = value === 'all' ? '' : value;
    setStatus(newStatus);
    updateURL({ status: newStatus || undefined });
  };

  // Effects for debounced searches
  useEffect(() => {
    updateURL({ partnerName: debouncedPartnerNameQuery || undefined });
  }, [debouncedPartnerNameQuery, updateURL]);

  useEffect(() => {
    updateURL({ leadName: debouncedLeadNameQuery || undefined });
  }, [debouncedLeadNameQuery, updateURL]);

  useEffect(() => {
    updateURL({ minAmount: debouncedMinAmount && debouncedMinAmount > 0 ? debouncedMinAmount?.toString() : undefined });
  }, [debouncedMinAmount, updateURL]);

  useEffect(() => {
    updateURL({ maxAmount: debouncedMaxAmount && debouncedMaxAmount > 0 ? debouncedMaxAmount?.toString() : undefined });
  }, [debouncedMaxAmount, updateURL]);

  const clearAllFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setPartnerNameQuery('');
    setLeadNameQuery('');
    setType('');
    setStatus('');
    setMinAmount(0);
    setMaxAmount(0);
    router.push(pathname);
  };

  const hasFilters = startDate || endDate || partnerNameQuery || leadNameQuery || type || status || minAmount || maxAmount;
  const activeFiltersCount = [startDate, endDate, partnerNameQuery, leadNameQuery, type, status, minAmount, maxAmount].filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="text-lg font-semibold text-gray-900">Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {activeFiltersCount}
              </span>
            )}
          </div>
          {hasFilters && (
            <Button onClick={clearAllFilters} variant="outline" size="sm">
              <X className="w-4 h-4 mr-1" />
              Limpar todos
            </Button>
          )}
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Type Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tipo</label>
            <Select value={type || 'all'} onValueChange={handleTypeChange}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder="Selecionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="INCOME">Crédito</SelectItem>
                <SelectItem value="EXPENSE">Débito</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <Select value={status || 'all'} onValueChange={handleStatusChange}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder="Selecionar status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="PAID">Concluída</SelectItem>
                <SelectItem value="PENDING_PAYMENT">Pendente</SelectItem>
                <SelectItem value="PENDING_RECEIPT">Falhada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Data inicial</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !startDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, 'dd/MM/yyyy', { locale: ptBR })
                  ) : (
                    <span>Selecionar data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={handleStartDateChange}
                  disabled={(date) => date > new Date() || Boolean(endDate && date > endDate)}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Data final</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !endDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? (
                    format(endDate, 'dd/MM/yyyy', { locale: ptBR })
                  ) : (
                    <span>Selecionar data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={handleEndDateChange}
                  disabled={(date) =>
                    date > new Date() || Boolean(startDate && date < startDate)
                  }
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Partner Name Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Nome do parceiro</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar parceiro..."
                value={partnerNameQuery}
                onChange={(e) => setPartnerNameQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Lead Name Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Nome do lead</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar lead..."
                value={leadNameQuery}
                onChange={(e) => setLeadNameQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Min Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Valor mínimo</label>
            <CurrencyInput
              value={minAmount}
              onChange={(e) => setMinAmount(e)}
            />
          </div>

          {/* Max Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Valor máximo</label>
            <CurrencyInput
              value={maxAmount}
              onChange={(e) => setMaxAmount(e)}
            />
          </div>
        </div>

        {/* Active Filters Display */}
        {hasFilters && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-500">Filtros ativos:</span>
              
              {type && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Tipo: {type === 'credit' ? 'Crédito' : type === 'debit' ? 'Débito' : type === 'bonus' ? 'Bônus' : 'Compra de Lead'}
                  <button
                    onClick={() => handleTypeChange('all')}
                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {status && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Status: {status === 'completed' ? 'Concluída' : status === 'pending' ? 'Pendente' : status === 'failed' ? 'Falhada' : 'Cancelada'}
                  <button
                    onClick={() => handleStatusChange('all')}
                    className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {partnerNameQuery && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Parceiro: "{partnerNameQuery}"
                  <button
                    onClick={() => setPartnerNameQuery('')}
                    className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {leadNameQuery && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Lead: "{leadNameQuery}"
                  <button
                    onClick={() => setLeadNameQuery('')}
                    className="ml-1 hover:bg-yellow-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {startDate && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  A partir de {format(startDate, 'dd/MM/yyyy', { locale: ptBR })}
                  <button
                    onClick={() => handleStartDateChange(undefined)}
                    className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {endDate && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Até {format(endDate, 'dd/MM/yyyy', { locale: ptBR })}
                  <button
                    onClick={() => handleEndDateChange(undefined)}
                    className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {minAmount && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Min: R$ {formatCurrency(minAmount)}
                  <button
                    onClick={() => setMinAmount(0)}
                    className="ml-1 hover:bg-indigo-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {maxAmount && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Max: R$ {formatCurrency(maxAmount)}
                  <button
                    onClick={() => setMaxAmount(0)}
                    className="ml-1 hover:bg-indigo-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}