'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, X, Search } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { DashboardTreatmentSelector } from '../../partner/leads/_components/dashboard-treatment-selector';
import type { TreatmentCategory } from '@/types/enums/treatment-category';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StateSelector } from './state-selector';

interface Treatment {
  id: string;
  name: string;
  category: TreatmentCategory
  price: number;
}

interface PartnersFilterProps {
  treatments: Treatment[];
}

export function PartnersFilter({ treatments }: PartnersFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [nameQuery, setNameQuery] = useState('');
  const [statusQuery, setStatusQuery] = useState('')
  const [cityQuery, setCityQuery] = useState('')
  const [stateQuery, setStateQuery] = useState('')
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  
  // Debounce para busca por nome
  const debouncedNameQuery = useDebounce(nameQuery, 500);

  // Initialize filters from URL params
  useEffect(() => {
    const startParam = searchParams.get('startDate');
    const endParam = searchParams.get('endDate');
    const nameParam = searchParams.get('name');
    const statusParam = searchParams.get('status');
    const cityParam = searchParams.get('city');
    const stateParam = searchParams.get('state');
    const treatmentIdsParam = searchParams.get('treatmentIds');
    
    if (startParam) {
      setStartDate(new Date(parseInt(startParam)));
    }
    if (endParam) {
      setEndDate(new Date(parseInt(endParam)));
    }
    if (nameParam) {
      setNameQuery(nameParam);
    }

    if (statusParam) {
      setStatusQuery(statusParam)
    }

    if (cityParam) {
      setCityQuery(cityParam)
    }

    if (stateParam) {
      setStateQuery(stateParam)
    }
    
    if (treatmentIdsParam) {
      setSelectedTreatments(treatmentIdsParam.split(',').filter(Boolean));
    }
    
  }, [searchParams]);

  // Function to update URL with current filters
  const updateURL = useCallback((updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams);
    
    // Apply updates
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
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

  // Handle treatments change
  const handleTreatmentsChange = (treatmentIds: string[]) => {
    setSelectedTreatments(treatmentIds);
    updateURL({
      treatmentIds: treatmentIds.length > 0 ? treatmentIds.join(',') : undefined
    });
  };

  const handleStatusChange = (value: string) => {
    if (value === "ALL") {
      setStatusQuery('')
      
      updateURL({
        status: undefined
      })
    } else {
      setStatusQuery(value)
      updateURL({
        status: value
      })
    }
    
  }

  const handleCityChange = (city: string) => {
    setCityQuery(city)
    updateURL({
      city: city
    })
  }

  const handleStateChange = (state: string) => {
    setStateQuery(state)
    updateURL({
      state: state
    })
  }

  // Effect for debounced name search
  useEffect(() => {
    updateURL({
      name: debouncedNameQuery || undefined
    });
  }, [debouncedNameQuery, updateURL]);

  const clearAllFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setNameQuery('');
    setCityQuery('')
    setStateQuery('')
    setStatusQuery('')
    setSelectedTreatments([]);
    router.push(pathname);
  };

  const hasFilters = startDate || endDate || nameQuery || statusQuery || cityQuery || stateQuery || selectedTreatments.length > 0;
  const activeFiltersCount = [startDate, endDate, nameQuery, statusQuery, cityQuery, stateQuery, selectedTreatments.length > 0].filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-gray-700">
            Filtros {activeFiltersCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
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

        {/* Filters Row */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Name Search */}
          <div className="flex flex-2 flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Nome do parceiro</label>
            <div className="relative flex flex-col">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome..."
                value={nameQuery}
                onChange={(e) => setNameQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* City */}
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Cidade</label>
            <Input value={cityQuery} onChange={e => handleCityChange(e.target.value)} placeholder='Pesquise por cidade' />
          </div>

          {/* State */}
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Estado</label>
            <StateSelector 
              value={stateQuery}
              onChange={handleStateChange}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Status Search */}
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <Select value={statusQuery} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="PAYMENT_PENDING">Pagamento pendente</SelectItem>
                <SelectItem value="CONFIRMATION_PENDING">Pendente de confirmação</SelectItem>
                <SelectItem value="ACTIVE">Ativo</SelectItem>
                <SelectItem value="SUSPENDED">Suspenso</SelectItem>
                <SelectItem value="RECHARGE_REQUIRED">Recarga necessária</SelectItem>
                <SelectItem value="CANCELED"> Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Start Date */}
          <div className="flex flex-1 flex-col gap-2">
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
          <div className="flex flex-1 flex-col gap-2">
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

          {/* Treatments Filter */}
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Tratamentos</label>
            <DashboardTreatmentSelector
              value={selectedTreatments}
              onChange={handleTreatmentsChange}
              placeholder="Selecionar tratamentos"
              className="w-full"
            />
          </div>
        </div>

        {/* Active Filters Display */}
        {hasFilters && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-500">Filtros ativos:</span>
              
              {nameQuery && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Nome: "{nameQuery}"
                  <button
                    onClick={() => setNameQuery('')}
                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
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
              
              {selectedTreatments.length > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {selectedTreatments.length} tratamento{selectedTreatments.length > 1 ? 's' : ''}
                  <button
                    onClick={() => handleTreatmentsChange([])}
                    className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {cityQuery && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Cidade: "{cityQuery}"
                  <button
                    onClick={() => handleCityChange('')}
                    className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {stateQuery && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Estado: "{stateQuery}"
                  <button
                    onClick={() => handleStateChange('')}
                    className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {statusQuery && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Status: "{statusQuery}"
                  <button
                    onClick={() => handleStatusChange('')}
                    className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
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