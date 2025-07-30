'use client'

import React, { useState } from 'react';
import { Key, ArrowRight, Shield, Zap, Globe, Eye, EyeOff } from 'lucide-react';

import { authenticateWithApiKey } from '@/lib/api/actions/auth';
import { toast } from 'sonner';

const AuthPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData()
      formData.append("apiKey", apiKey)

      await authenticateWithApiKey(formData)
    } catch (err) {
      console.error("Error authenticating: ", err)
      toast.error("Chave inválida")
    } finally {
      setIsLoading(false);
      setApiKey("")
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Segurança Avançada',
      description: 'Proteção de dados com criptografia de ponta a ponta'
    },
    {
      icon: Zap,
      title: 'Performance Otimizada',
      description: 'Distribuição de leads em tempo real com alta velocidade'
    },
    {
      icon: Globe,
      title: 'Alcance Nacional',
      description: 'Cobertura completa para clínicas em todo o território'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Left Panel - Branding & Features */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-16 py-12">
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">MaxLeads</h1>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Conecte-se ao futuro da
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> gestão de leads</span>
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed">
              Transforme leads em oportunidades reais com nossa plataforma inteligente de distribuição para clínicas de estética.
            </p>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 group">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex items-center space-x-6 text-slate-400">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">1.2K+</div>
                <div className="text-sm">Leads processados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">150+</div>
                <div className="text-sm">Clínicas parceiras</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-sm">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Authentication Form */}
      <div className="flex-1 lg:max-w-md xl:max-w-lg flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">MaxLeads</h1>
            </div>
          </div>

          {/* Auth Card */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Key className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo de volta</h2>
              <p className="text-gray-600">Insira sua chave API para acessar o painel</p>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                  Chave API
                </label>
                <div className="relative">
                  <input
                    id="apiKey"
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Insira sua chave API"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                    {error}
                  </p>
                )}
              </div>

              <button
                type="button"
                disabled={!apiKey.trim() || isLoading}
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 group"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Autenticando...</span>
                  </div>
                ) : (
                  <>
                    <span>Acessar Painel</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                Precisa de ajuda?{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Entre em contato
                </a>
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-white font-medium mb-1">Segurança Garantida</p>
                <p className="text-xs text-slate-300">
                  Sua chave API é criptografada e armazenada com segurança. Nunca compartilhamos seus dados.
                </p>
              </div>
            </div>
          </div>

          {/* Demo Hint */}
          <div className="mt-4 text-center">
            <p className="text-xs text-slate-400">
              
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;