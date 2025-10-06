import { NextResponse } from 'next/server'

import { checkReferralCodeAvailabilityAction } from '@/lib/api/actions/affiliate'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code || code.length < 4) {
    return NextResponse.json({ exists: false }, { status: 400 })
  }

  const available = await checkReferralCodeAvailabilityAction(code)

  return NextResponse.json({ available })
}
