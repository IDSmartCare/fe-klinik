export const getApiBisnisOwner = async ({ url }: { url: string }) => {
    try {
        const getApi = await fetch(`${process.env.NEXT_PUBLIC_URL_BO}/${url}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${process.env.NEXT_PUBLIC_TOKEN_BO}`
            }
        })
        const resApi = await getApi.json()
        return resApi
    } catch (error) {
        return null
    }
}

export const postApiBisnisOwner = async ({ url, data }: { url: string, data: any }) => {
    try {
        const getApi = await fetch(`${process.env.NEXT_PUBLIC_URL_BO}/${url}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${process.env.NEXT_PUBLIC_TOKEN_BO}`
            },
            method: "POST",
            body: JSON.stringify(data)
        })
        const resApi = await getApi.json()
        return resApi
    } catch (error) {
        return null
    }
}