'use client'

import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Building2, 
  Users,
  Target,
  type LucideProps,
} from 'lucide-react';

import { StatCard } from './_components/stat-card';
import { getDashboardDataAction } from '@/lib/api/actions/dashboard';
import { relativeTime } from '@/lib/utils';

interface Stat {
  title: string
  value: string
  change: string
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
  color: string
}

interface DashTreatment {
  name: string
  leadsCount: number
  partnersCount: number
  formsCount: number
}

interface RecentLead {
  name: string
  treatment: string
  phone: string
  status: string
  time: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stat[]>([])
  const [treatments, setTreatments] = useState<DashTreatment[]>([]);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([])

  useEffect(() => {
    async function getDashboardData() {
      const dashboardData = await getDashboardDataAction()

      setTreatments(
        dashboardData.treatment_performance.map(treatment => {
          return {
            name: treatment.treatment,
            leadsCount: treatment.total_leads,
            partnersCount: treatment.total_partners,
            formsCount: 0
          }
        })
      )

      setStats([
        { title: 'Total de Leads', value: String(dashboardData.total_leads), change: '+0%', icon: Users, color: 'text-blue-600' },
        { title: 'Partners Ativos', value: String(dashboardData.active_partners), change: '+0%', icon: Building2, color: 'text-green-600' },
        { title: 'Formulários', value: String(dashboardData.total_forms), change: '+0%', icon: FileText, color: 'text-purple-600' },
        { title: 'Taxa de Conversão', value: `${dashboardData.conversion_rate}%`, change: '+0%', icon: Target, color: 'text-orange-600' }
      ])

      setRecentLeads(
        dashboardData.recent_leads.map(recentLead => {
          return {
            treatment: recentLead.treatment,
            name: recentLead.name,
            phone: recentLead.phone_number,
            status: recentLead.status,
            time: relativeTime(recentLead.created_at),
          }
        })
      )
    }

    getDashboardData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Última atualização: há 0 minutos
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Leads Recentes</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentLeads.map((lead, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{lead.name}</p>
                      <p className="text-sm text-gray-500">{lead.treatment}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      lead.status === 'dispatched' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {lead.status === 'dispatched' ? 'Enviado' : 'Pendente'}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">há {lead.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Performance por Tratamento</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {treatments.map((treatment, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{treatment.name}</p>
                    <p className="text-sm text-gray-500">{treatment.leadsCount} leads gerados</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{treatment.partnersCount} partners</p>
                    <div className="w-20 bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{width: `${Math.min(treatment.leadsCount / 250 * 100, 100)}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
