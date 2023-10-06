import { LoaderFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { useEffect, useState } from "react"


export const loader:LoaderFunction = ({context}) => {
    const {streamsUri} = context
    return {
        streamsUri
    }
}

export default function Services() {

    const {streamsUri} = useLoaderData()
    const [access, setAccess] = useState<any[]>([])

    useEffect(() => {
        const streams = new EventSource(streamsUri)
        streams.onmessage = (event) => setAccess(prev => [...prev, JSON.parse(event.data)])
    }, [])


    return (
        <div className="flex flex-col gap-4 font-xs">
            {access.map((a, i) => <pre key={i}>
                <code className="font-mono">{JSON.stringify(a, undefined, "\t")}</code>
            </pre>)}
        </div>
    )
}