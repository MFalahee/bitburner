/** @param {import(".").NS } ns */
export async function buyWarehouseUpgs(ns, division, city) {
    ns.tail()
    ns.print(ns.corporation.getWarehouse(division, city))
    ns.print(ns.corporation.getWarehouse(division, city).level)
}