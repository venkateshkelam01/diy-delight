export function hasImpossibleCombo(selectedIds = [], incompatPairs = []) {
    if (!selectedIds.length) return false
    const set = new Set(selectedIds)
    return incompatPairs.some(p => set.has(p.option_a) && set.has(p.option_b))
}
