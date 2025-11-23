export default async function Back(){
    const res = await fetch("http://localhost:8080/user/new",{cache:"force-cache"})
    const message  = await res.json()
    console.log(message)
    return (
        <div>
            {JSON.stringify(message)}
        </div>
    )
}