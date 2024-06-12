'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButtonServer() {
    const { pending } = useFormStatus()

    return (
        <button type="submit" className='btn btn-sm btn-primary' disabled={pending}>
            Submit
        </button>
    )
}