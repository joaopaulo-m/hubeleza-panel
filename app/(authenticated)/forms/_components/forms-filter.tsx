'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import type { Treatment } from "@/types/entities/treatment"
import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { DashboardTreatmentSelector } from "../../partner/leads/_components/dashboard-treatment-selector";

export interface FormsFilterProps {
  treatments: Treatment[]
}

export function FormsFilter(props: FormsFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [nameQuery, setNameQuery] = useState('');
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  
  const debouncedNameQuery = useDebounce(nameQuery, 500);

  useEffect(() => {
    const nameParam = searchParams.get('name');
    const treatmentIdsParam = searchParams.get('treatmentIds');
    
    if (nameParam) {
      setNameQuery(nameParam);
    }
    if (treatmentIdsParam) {
      setSelectedTreatments(treatmentIdsParam.split(',').filter(Boolean));
    }
  }, [searchParams]);

  const updateURL = useCallback((updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    params.delete('page');
    
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  const handleTreatmentsChange = (treatmentIds: string[]) => {
    setSelectedTreatments(treatmentIds);
    updateURL({
      treatmentIds: treatmentIds.length > 0 ? treatmentIds.join(',') : undefined
    });
  };

  useEffect(() => {
    updateURL({
      name: debouncedNameQuery || undefined
    });
  }, [debouncedNameQuery, updateURL]);

  const clearAllFilters = () => {
    setNameQuery('');
    setSelectedTreatments([]);
    router.push(pathname);
  };

  const hasFilters = nameQuery || selectedTreatments.length > 0;
  const activeFiltersCount = [nameQuery, selectedTreatments.length > 0].filter(Boolean).length;

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
            <label className="text-sm font-medium text-gray-700">Nome do formulário</label>
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

          {/* Treatments Filter */}
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Tratamentos</label>
            <DashboardTreatmentSelector
              value={selectedTreatments}
              onChange={handleTreatmentsChange}
              placeholder="Selecionar tratamentos"
              preloadedTreatments={props.treatments}
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}