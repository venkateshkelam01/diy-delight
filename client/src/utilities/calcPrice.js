export function calcTotal(base_price_cents, selectedOptions) {
    const add = (selectedOptions || []).reduce((sum, o) => sum + (o?.price_cents || 0), 0)
    return (base_price_cents || 0) + add
}
export const centsToUSD = (cents = 0) =>
    (cents / 100).toLocaleString(undefined, { style: 'currency', currency: 'USD' })
