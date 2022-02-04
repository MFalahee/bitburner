/** @param {import(".").NS } ns */

export async function factionModule(ns) {
        //only works for factions you already have access to.
        //function accepts two arguments when you want to activate favor limits (stop getting rep with current faction at limit)
        //[arg[0], arg[1]] ['f', favorLimit]

        /**
         * 
         * works as is
         * will come back later probably to automate joining factions and automatically purchase augmentations.
         * once relevant .exes are available from the server, we need to backdoor the servers [for now] to get the faction invites.
         * Once we have the invites, we check the list of augmentations from the faction before joining, and accept only if we have augmentations left to purchase.
         * After we haved joined all factions from backdooring servers-> proceed
         * 
         * I'm tempted to make this modular and work within singu.js, but I'm not sure how to do that quite yet.
         */
        // ns.tail();
        // ns.disableLog('ALL');
        ns.stopAction();
        var count = 0;
        var mode = ns.args[0];
        var favorLimit;
        if (mode == 'f') {
            (ns.args[1] != null) ? favorLimit = ns.args[1]: favorLimit = 25;
        } else {
            favorLimit = 999;
        }
        var factions = ns.getPlayer().factions;

        function log(data) {
            if (factions != null) {
                let rows = new Array(factions.length, null);
            }
            // one top row of filler for the table, 1 '╔',  40 spaces filled  with '═', then 1 '╗'.
            // then the actual log surrounded in a table of the same width as the screen - pad with '║'' and '║'
            let topRow = `╔${'═'.repeat(40)}╗`;
            let bottomRow = `╚${'═'.repeat(40)}╝`;
            let logRow = `║${information}${' '.repeat(40 - information.length)}║`;
            let log = `${topRow}\n${logRow}\n${bottomRow}`;
            ns.clearLog();
            ns.print(log);
        }

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
                        } else if (rep >= maxRepValue) {
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
                        log(ans)
                    }
                    ans.t == true ? null : count++;
                    ans.t == true ? ns.print('Training') : null
                    ans.t == true ? await ns.sleep(10000) : null
                } else if (factions.length == 0) {
                    ns.print('No factions')
                    break;
                }
                count >= factions.length ? count = 0 : null;
                await ns.sleep(2500)
            }
        }