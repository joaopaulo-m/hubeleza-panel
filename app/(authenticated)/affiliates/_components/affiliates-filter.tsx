'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import type { Treatment } from "@/types/entities/treatment"
import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function AffiliatesFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [nameQuery, setNameQuery] = useState('');
  const [referralCodeQuery, setReferralCodeQuery] = useState('');
  const [statusQuery, setStatusQuery] = useState('')
  
  const debouncedNameQuery = useDebounce(nameQuery, 500);
  const debouncedReferralCodeQuery = useDebounce(referralCodeQuery, 500);

  useEffect(() => {
    const nameParam = searchParams.get('name');
    const referralCodeParam = searchParams.get('referralCode');
    const statusParam = searchParams.get('status');
    
    if (nameParam) {
      setNameQuery(nameParam);
    }

    if (referralCodeParam) {
      setReferralCodeQuery(referralCodeParam);
    }

    if (statusParam) {
      setStatusQuery(statusParam)
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

  useEffect(() => {
    updateURL({
      name: debouncedNameQuery || undefined,
      referralCodeQuery: debouncedReferralCodeQuery || undefined
    });
  }, [debouncedNameQuery, debouncedReferralCodeQuery, updateURL]);

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
    
  const clearAllFilters = () => {
    setNameQuery('');
    setReferralCodeQuery('');
    setStatusQuery('')
    router.push(pathname);
  };

  const hasFilters = nameQuery || referralCodeQuery || statusQuery;
  const activeFiltersCount = [nameQuery, referralCodeQuery, statusQuery].filter(Boolean).length;

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
            <label className="text-sm font-medium text-gray-700">Nome do afiliado</label>
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

          {/* Referral Code Search */}
          <div className="flex flex-2 flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Código do afiliado</label>
            <div className="relative flex flex-col">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome..."
                value={referralCodeQuery}
                onChange={(e) => setReferralCodeQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <Select value={statusQuery} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              <SelectItem value="CONFIRMATION_PENDING">Pendente de confirmação</SelectItem>
              <SelectItem value="ACTIVE">Ativo</SelectItem>
              <SelectItem value="CANCELED"> Cancelado</SelectItem>
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

              {referralCodeQuery && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Código: "{referralCodeQuery}"
                  <button
                    onClick={() => setReferralCodeQuery('')}
                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
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