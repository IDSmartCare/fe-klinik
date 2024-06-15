import { NextResponse } from 'next/server'

export async function GET() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_WILAYAH}/api/provinces.json`)
    const prov = await res.json()

    if (!res.ok) {
        return NextResponse.json({ prov: [] })
    }

    return NextResponse.json({ prov })
}