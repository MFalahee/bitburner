//now that we are in bitnode 4? we have access to singularity functions. Lets figure out a use for them.
//
/** @param {import(".").NS } ns */
export async function main(ns) {
    ns.disableLog('sleep');
    ns.tail();
    var crimeModuleBool = false;
    var crimes = ['Shoplift', 'Rob store', 'Mug someone', 'Larceny', 'Deal Drugs', 'Bond Forgery', 'Traffick illegal Arms', 'Homicide', 'Grand theft Auto', 'Kidnap and Ransom', 'Assassinate', 'Heist'];
    var chances = new Array(crimes.length, null)

    async function updateChances() {
        let i = 0;
        while (i < crimes.length) {
            chances[i] = ns.getCrimeChance(crimes[i]);
            i++;
        }
    }
    async function doCrime(crime) {
        if (!ns.isBusy()){
            ns.print(`Doing crime: ${crimes[crime]}`);
            return ns.commitCrime(crimes[crime])
        }
    }

    async function findBestCrime() {
        let i = 0;
        let best = 0;
        let temp = 0;
        while (i < crimes.length) {
            //loop through, and find the furthest crime along the array with 100% chance and return it.
            if (chances[i] == 1) {
                best = i;
            }
            i++;
        }
        return best
    }
    crimeModuleBool = await ns.prompt(`Load Crime Module?`);

    
    while (true) {
        ns.clearLog()
        if (crimeModuleBool) {
            await updateChances();
            let best = await findBestCrime();
            let wait = await doCrime(best);
            await ns.sleep(wait);
        }
        await ns.sleep(1000);
    }
}