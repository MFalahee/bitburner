//this is a function that will be used to display current work information using singularity functions.
/** @param {import(".").NS } ns */
export async function main(ns) {
    let time = new Date();
    let totalExperience = 0;
    ns.tail()
    while(true) {
        ns.clearLog()
        let player = ns.getPlayer()
        ns.print(`Current Work: ${player.currentWorkFactionDescription}`);
        ns.print(`Current Work: ${player.currentWorkFactionName}`);
        ns.print(`Current cha gain: ${player.workChaExpGainRate}`);
        ns.print(`cha xp mult: ${player.charisma_exp_mult}`)
        ns.print(player.charisma_exp_mult * player.workChaExpGainRate)
        ns.print(`Charisma Experience gained: ${player.workChaExpGained}`);
        if (time && player.workChaExpGained > 0) {
            ns.print(Math.floor(player.workChaExpGained / ((new Date().getTime() - time.getTime())/1000)) + ' experience per second');
        }
        ns.print(new Date().getTime() - time)
        await ns.sleep(1000);
    }
}

// this script was made simply to understand the player object a little better and figure out how to implement a training module.