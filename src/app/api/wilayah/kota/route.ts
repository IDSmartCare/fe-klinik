import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_WILAYAH}/api/regencies/${id}.json`)
    const kota = await res.json()

    if (!res.ok) {
        return NextResponse.json({ kota: [] })
    }

    return NextResponse.json({ kota })
}