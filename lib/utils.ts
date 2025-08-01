import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function relativeTime(timestamp: string | Date): string {
  const date = new Date(timestamp)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return `${seconds} segundo${seconds !== 1 ? 's' : ''} atrás`

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minuto${minutes !== 1 ? 's' : ''} atrás`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hora${hours !== 1 ? 's' : ''} atrás`

  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} dia${days !== 1 ? 's' : ''} atrás`

  const months = Math.floor(days / 30)
  if (months < 12) return `${months} mês${months !== 1 ? 'es' : ''} atrás`

  const years = Math.floor(months / 12)
  return `${years} ano${years !== 1 ? 's' : ''} atrás`
}

