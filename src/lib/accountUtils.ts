const INITIALS_COLORS = [
  "bg-blue-600", "bg-emerald-600", "bg-violet-600",
  "bg-amber-600", "bg-rose-600", "bg-teal-600",
  "bg-indigo-600", "bg-orange-600",
]

export const getInitials = (name: string): string => {
    return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
}

export const getInitialsColor = (name: string): string => {
    let hash = 0
    for (const ch of name) hash = ch.charCodeAt(0) + ((hash << 5) - hash)
    return INITIALS_COLORS[Math.abs(hash) % INITIALS_COLORS.length]

}

export const formatBalance = (amount: number, currencyCode: string): string =>{
    return new Intl.NumberFormat("en", { style: "currency", currency: currencyCode }).format(amount)
}