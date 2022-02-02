/** @param {import(".").NS } ns */

export async function main(ns) {
    ns.tail();
    ns.stopAction();
    ns.disableLog('ALL');
    var mode = ns.args[0];
    var factions = ns.getPlayer().factions;
    //setup faction max rep needed by looking at augmentation prices
    async function getMaxRep(mode) {
        for (var i = 0; i < factions.length; i++) {
            var faction = factions[i]
            //take each faction, and use ns.getAugmentationsFromFaction(faction) to get the list of augmentations
            //get price of each augmentation-- find highest priced augmentation for each faction. Note- exclude neuroflux governor from this list of augmentations.
            //set faction max rep as the price of the highest priced augmentation.
            var factionMaxRep = ns.getAugmentationsFromFaction(faction).filter(a => a != 'NeuroFlux Governor').sort(function (a, b) {
                return ns.getAugmentationPrice(b) - ns.getAugmentationPrice(a);
            })[0]
            ns.print(`${faction} max rep aug: ${factionMaxRep} price: ${ns.getAugmentationPrice(factionMaxRep)}`)
            //set faction max rep as the price of the highest priced augmentation.
            let maxRepValue = ns.getAugmentationPrice(factionMaxRep)
            let rep = ns.getFactionRep(faction)
            let repGainedPerCycle = rep;
            let totalRepGained = 0

            if (rep < maxRepValue) {
                ns.print(`${faction} needs rep.`)
                if (!ns.isBusy()) {
                    while (rep < maxRepValue) {
                    ns.clearLog();
                    ns.workForFaction(faction, 'Hacking Contracts', true) ? null : ns.workForFaction(faction, 'Field Work', true)
                    repGainedPerCycle = rep;
                    rep = ns.getFactionRep(faction)
                    repGainedPerCycle = (rep - repGainedPerCycle);
                    totalRepGained += repGainedPerCycle;
                    ns.print(`WORK CYCLE === ${faction.toUpperCase()}`)
                    ns.print(`REP:${ns.nFormat(rep, '0,0.00')}`)
                    ns.print(`TO MAX: ${ns.nFormat(maxRepValue - rep, '0,0.00')}`)
                    ns.print(`GAINED: ${ns.nFormat(totalRepGained, '0,0.00')}`)
                    let favor = ns.getFactionFavorGain(faction)
                    ns.print(`FAVOR: ${favor}`)
                    if (mode === 'f' && favor > 50) {
                        ns.print('FAVOR LIMIT REACHED')
                        ns.stopAction();
                        break;
                    }
                    await ns.sleep(30000)
                    }
                }
                // ns.workForFaction(faction, 'Hacking Contracts', true)
            }
        }
    }

    while (true) {
        if (factions.length > 0 && mode) {
            await getMaxRep(mode)
        }
        await ns.sleep(2500)
    }
}