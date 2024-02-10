export default function ErrorMessage({error}: { error?: string }) {
    if (!error)
        return <></>
    return <p className={"text-red-600 mt-2"}>{error}</p>
}