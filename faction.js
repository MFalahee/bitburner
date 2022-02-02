/** @param {import(".").NS } ns */

export async function main(ns) {
    ns.tail();
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
            if (rep < maxRepValue) {
                ns.print(`${faction} needs some work.`)
                if (!ns.isBusy()) {
                    while (rep < maxRepValue) {
                    ns.print('doing work')
                    ns.print(`${faction} rep: ${rep} -- rep to go: ${maxRepValue - rep}`)
                    ns.workForFaction(faction, 'Hacking Contracts', true) ? null : ns.workForFaction(faction, 'Field Work', true)
                    rep = ns.getFactionRep(faction)
                    let favor = ns.getFactionFavorGain(faction)
                    ns.print(`favorGain: ${favor}`)
                    if (mode === 'f' && favor > 50) {
                        ns.print('Stopping work for favor')
                        ns.stopAction();
                        break;
                    }
                    await ns.sleep(60000)
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