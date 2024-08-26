export async function POST(req: Request) {
    const body = await req.json()

    try {
        const postApi = await fetch(`${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/cppt`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`
            },
            body: JSON.stringify(body)
        })
        return postApi
    } catch (error: any) {
        return new Response(error.message, { status: 400 })
    }

}