export const dateConverter = (inputdate: string) => {
    const date = new Date(inputdate)
    return date.toLocaleDateString("en-US",{
        year:"numeric",
        month:"long",
        day:"numeric"
    })
}