import React from "react"
import { Suspense } from "react"
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Wallet, 
  TrendingUp, 
  Users, 
  DollarSign,
  ArrowLeft,
  Shield,
  Activity
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

// Componentes cliente que serão criados separadamente
import { TransactionsTable } from "./_components/transactions-table"
import { LeadsTable } from "./_components/leads-table"

// Types e utils
import { cn, formatCurrency } from "@/lib/utils"
import { PartnerStatus } from "@/types/enums/partner-status"

// Mock das actions - você deve implementar essas funções
import { getPartnerDetailsAction } from "@/lib/api/actions/partner"
import { getPartnerWalletAction } from "@/lib/api/actions/wallet"
import { getPartnerLeadsAction } from "@/lib/api/actions/lead"
import { WalletBalance } from "./_components/wallet-balance"
import { PartnerActions } from "./_components/partner-actions"

// Configuração dos status
const STATUS_CONFIG = {
  [PartnerStatus.PAYMENT_PENDING]: {
    label: "Pagamento Pendente",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200"
  },
  [PartnerStatus.CONFIRMATION_PENDING]: {
    label: "Confirmação Pendente", 
    color: "bg-blue-50 text-blue-700 border-blue-200"
  },
  [PartnerStatus.ACTIVE]: {
    label: "Ativo",
    color: "bg-green-50 text-green-700 border-green-200"
  },
  [PartnerStatus.RECHARGE_REQUIRED]: {
    label: "Recarga Necessária",
    color: "bg-orange-50 text-orange-700 border-orange-200"
  },
  [PartnerStatus.SUSPENDED]: {
    label: "Suspenso",
    color: "bg-red-50 text-red-700 border-red-200"
  },
  [PartnerStatus.CANCELED]: {
    label: "Cancelado",
    color: "bg-gray-50 text-gray-700 border-gray-200"
  }
}

type PartnerDetailsPageProps = {
  params: Promise<{ id: string }>
}

export default async function PartnerDetailsPage({ params }: PartnerDetailsPageProps) {
  const { id } = await params
  
  // Buscar dados do servidor
  const partner = await getPartnerDetailsAction(id)
  const wallet = await getPartnerWalletAction(id)
  const leads = await getPartnerLeadsAction(id)

  if (!partner) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-gray-500">Parceiro não encontrado</p>
          <Link href="/partners">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Parceiros
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const statusConfig = STATUS_CONFIG[partner.status]
  
  // Calcular estatísticas
  const stats = {
    totalLeads: leads.length,
    totalTransactions: wallet.transactions.length,
    totalSpent: wallet.transactions
      .filter(t => t.type === 'DEBIT')
      .reduce((sum, t) => sum + t.amount, 0),
    avgLeadPrice: leads.length > 0 
      ? wallet.transactions
          .filter(t => t.lead)
          .reduce((sum, t) => sum + (t.lead_price || 0), 0) / leads.length
      : 0
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col items-start gap-2">
          <Link href="/partners">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">{partner.name}</h1>
            <p className="text-gray-500">{partner.company_name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={statusConfig.color}>
            {statusConfig.label}
          </Badge>
          <PartnerActions partner={partner} status={partner.status} />
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="h-full py-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Saldo da Wallet</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(wallet.balance)}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="h-full py-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total de Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="h-full py-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Investido</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalSpent)}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="h-full py-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Preço Médio/Lead</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.avgLeadPrice)}
                </p>
              </div>
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Partner Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações do Parceiro */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Informações do Parceiro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{partner.email}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Telefone</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{partner.phone_number}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">CPF</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{partner.cpf}</span>
                  </div>
                </div>

                {partner.cnpj && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">CNPJ</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{partner.cnpj}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Localização</label>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">
                      {partner.city}, {partner.state} - {partner.cep}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Data de Cadastro</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">
                      {new Date(partner.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Status da Senha</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className={cn(
                      "text-sm",
                      partner.password_not_defined ? "text-red-600" : "text-green-600"
                    )}>
                      {partner.password_not_defined ? "Não definida" : "Definida"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tratamentos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Tratamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {partner.treatments.map((treatment) => (
                <div key={treatment.id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">{treatment.name}</p>
                  <p className="text-sm text-gray-500">{treatment.category}</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(treatment.price)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs com Detalhes */}
      <Card>
        <Tabs defaultValue="wallet" className="w-full">
          <CardHeader>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="wallet">Wallet & Transações</TabsTrigger>
              <TabsTrigger value="leads">Leads Recebidos</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="wallet" className="space-y-4">
              <WalletBalance partnerName={partner.name} wallet={wallet} />
              <Suspense fallback={<div className="flex items-center justify-center py-8">Carregando transações...</div>}>
                <TransactionsTable transactions={wallet.transactions} />
              </Suspense>
            </TabsContent>

            <TabsContent value="leads" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Histórico de Leads</h3>
                <Badge variant="outline">{leads.length} leads recebidos</Badge>
              </div>
              <Suspense fallback={<div className="flex items-center justify-center py-8">Carregando leads...</div>}>
                <LeadsTable leads={leads} />
              </Suspense>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Performance Mensal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Leads este mês:</span>
                        <span className="font-medium">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Gasto este mês:</span>
                        <span className="font-medium">{formatCurrency(1250)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Custo por lead:</span>
                        <span className="font-medium">{formatCurrency(104.17)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Tratamentos Populares</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {partner.treatments.slice(0, 3).map((treatment, index) => (
                        <div key={treatment.id} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{treatment.name}</span>
                          <Badge variant="secondary">{Math.floor(Math.random() * 20 + 5)} leads</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  )
}