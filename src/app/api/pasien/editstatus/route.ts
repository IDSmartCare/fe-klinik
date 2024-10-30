export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('idpasien') as string
    const target = searchParams.get('target') as string

    try {
        const fetchBody = await fetch(`${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/pasien/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ isAktif: target === "true" }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`
            }
        })
        return fetchBody
    } catch (error: any) {
        return new Response(error.message, { status: 400 })
    }

}