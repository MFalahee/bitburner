/** @param {import(".").NS } ns */

export async function main(ns) {
    //only works for factions you already have access to.
    //function accepts two arguments when you want to activate favor limits (stop getting rep with current faction at limit)
    //[arg[0], arg[1]] ['f', favorLimit]

    /**
     * 
     * works as is
     * will come back later probably to automate joining factions and automatically purchase augmentations.
     */

    ns.tail();
    ns.stopAction();
    ns.disableLog('ALL');
    var count = 0;
    var mode = ns.args[0];
    var favorLimit;
    if (mode == 'f') {
    (ns.args[1] != null) ? favorLimit = ns.args[1]: favorLimit = 25;
    } else {
        favorLimit = 999;
    }
    var factions = ns.getPlayer().factions;


    /**    
     * 
     * take each faction, and use ns.getAugmentationsFromFaction(faction) to get the list of augmentations
        get price of each augmentation-- find highest priced augmentation for each faction. Note- exclude neuroflux governor from this list of augmentations.
       set faction max rep as the price of the highest priced augmentation. 
    */
    async function getMaxRep(faction, mode, t) {
        var factionMaxRepAug = ns.getAugmentationsFromFaction(faction).filter(a => a != 'NeuroFlux Governor').sort(function (a, b) {
            return ns.getAugmentationRepReq(b) - ns.getAugmentationRepReq(a);
        })[0]
        // ns.print(`${faction} max rep aug: ${factionMaxRepAug} price: ${ns.getAugmentationRepReq(factionMaxRepAug)}`)
        //set faction max rep as the price of the highest priced augmentation.
        let training = false;
        t != null ? training = t : null;
        let maxRepValue = ns.getAugmentationRepReq(factionMaxRepAug);
        let rep = ns.getFactionRep(faction);
        let repGainedPerCycle = rep;
        let favor;

        if (rep != null && rep < maxRepValue) {
            if (!ns.isBusy() || training == true) {
                if (rep < maxRepValue && ns.getFactionFavorGain(faction) < favorLimit) {
                    ns.stopAction();
                    ns.workForFaction(faction, 'Hacking Contracts', true) ? null : ns.workForFaction(faction, 'Field Work', true)
                    repGainedPerCycle = rep;
                    rep = ns.getFactionRep(faction)
                    repGainedPerCycle = (rep - repGainedPerCycle);
                    favor = ns.getFactionFavorGain(faction)
                    training = true;
                    if (mode === 'f' && favor > favorLimit) {
                        ns.stopAction();
                    }
                } else if (rep >= maxRepValue){
                    ns.stopAction();
                    training = false;
                }
            }
        }

        let ans = {
            'faction': faction,
            'rep': rep,
            'repGainedPerCycle': repGainedPerCycle,
            'favor': favor,
            'factionMaxRep': factionMaxRepAug,
            'maxRepValue': maxRepValue,
            't': training
        }

        return ans
    }
    let ans = {}
    while (true) {
        if (factions.length > 0 && mode && count < factions.length) {
            ans = await getMaxRep(factions[count], mode, (ans.t != null ? ans.t : null))
            ns.print(ans)
            if (ans != null) {
                ns.print(`WORK CYCLE === ${ans.faction.toUpperCase()}`)
                ns.print(`REP:${ns.nFormat(ans.rep, '0,0.00')}`)
                ns.print(`TO MAX: ${ns.nFormat(ans.maxRepValue - ans.rep, '0,0.00')}`)
                // ns.print(`GAINED: ${ns.nFormat(ans.totalRepGained, '0,0.00')}`)
                ns.print(`FAVOR: ${ns.nFormat(ans.favor, '0,0.00')}`)
            }
            ans.t == true ? null : count++;
            ans.t == true ? ns.print('Training') : null
            ans.t == true ? await ns.sleep(10000) : null
        }
        count >= factions.length ? count = 0 : null;
        await ns.sleep(2500)
    }
}