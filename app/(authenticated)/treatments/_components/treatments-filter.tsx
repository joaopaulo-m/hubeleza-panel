'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { DashboardTreatmentSelector } from "../../partner/leads/_components/dashboard-treatment-selector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function TreatmentsFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [nameQuery, setNameQuery] = useState('');
  const [categoryQuery, setCategoryQuery] = useState('')
  
  const debouncedNameQuery = useDebounce(nameQuery, 500);

  useEffect(() => {
    const nameParam = searchParams.get('name');
    const categoryParam = searchParams.get('category');
    
    if (nameParam) {
      setNameQuery(nameParam);
    }
    
    if (categoryParam) {
      setCategoryQuery(categoryParam)
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

  const handleCategoryChange = (category: string) => {
    if (category === "all") {
      setCategoryQuery('')
      updateURL({
        category: undefined
      })
    } else {
      setCategoryQuery(category)
      updateURL({
        category: category
      })
    }
  }

  useEffect(() => {
    updateURL({
      name: debouncedNameQuery || undefined
    });
  }, [debouncedNameQuery, updateURL]);

  const clearAllFilters = () => {
    setNameQuery('');
    setCategoryQuery('');
    router.push(pathname);
  };

  const hasFilters = nameQuery || categoryQuery;
  const activeFiltersCount = [nameQuery, categoryQuery].filter(Boolean).length;

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
            <label className="text-sm font-medium text-gray-700">Nome do tratamento</label>
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

          {/* Category Filter */}
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Categoria</label>
            <Select value={categoryQuery} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="facial">Facial</SelectItem>
                <SelectItem value="body">Corporal</SelectItem>
                <SelectItem value="hair_removal">Depilação</SelectItem>
                <SelectItem value="hair">Capilar</SelectItem>
                <SelectItem value="wellness">Bem estar</SelectItem>
              </SelectContent>
            </Select>
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

              {categoryQuery && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Categoria: "{categoryQuery}"
                  <button
                    onClick={() => handleCategoryChange('')}
                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
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