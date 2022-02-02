//this script will be used to jump from faction to faction for rep
// when the player hits the maximum needed faction for each relevant faction

export async function main(ns) {
    ns.tail();
    var factions = ns.getPlayer().factions;

    //setup faction max rep needed by looking at augmentation prices
    async function getMaxRep() {
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
            //getFactionFavor(faction)
            //workForFaction(faction, workType, focus)
            let rep = ns.getFactionRep(faction)
            ns.print(`${faction} rep: ${rep} -- rep to go: ${maxRepValue - rep}`)
            if (rep < maxRepValue) {
                ns.print(`${faction} needs to work for more rep.`)
                // ns.workForFaction(faction, 'Hacking Contracts', true)
            }
        }
    }

    while (true) {
        if (factions.length > 0) {
            await getMaxRep()
        }
        await ns.sleep(2500)
    }
}