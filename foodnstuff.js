/** @param {import(".").NS } ns */
export async function main(ns) {
while(true) {
    await ns.sleep(1000)
    await ns.weaken('foodnstuff');
} }