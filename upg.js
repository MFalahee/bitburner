/** @param {import(".").NS } ns */
export async function main(ns) {
    ns.toast("Purchasing cores and ram for home if possible...");
    ns.upgradeHomeCores()
    ns.upgradeHomeRam()
}