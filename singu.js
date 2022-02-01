//now that we are in bitnode 4? we have access to singularity functions. Lets figure out a use for them.
//
/** @param {import(".").NS } ns */
export async function main(ns) {
    ns.disableLog('sleep');
    ns.tail();
    var playerStats = ns.getPlayer()
    var crimeModuleBool = false;
    var trainingModuleBool = false;
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
            ns.print(`Doing a ${crimes[crime]} job--`);
            return ns.commitCrime(crimes[crime])
        }
    }

    async function findBestCrime() {
        let i = 0;
        let best = 0;
        while (i < crimes.length) {
            //loop through, and find the furthest crime along the array with 100% chance and return it.
            if (chances[i] == 1) {
                best = i;
            }
            i++;
        }
        return best
    }
    trainingModuleBool = await ns.prompt(`Load Training Module?`);
    crimeModuleBool = await ns.prompt(`Load Crime Module?`);
   
    async function trainCharacter() {
        //this function will check stats and train character accordingly.
        //Stop training at level 100 for each stat
        //Stats to train: Charisma, Dexterity, Strength, Defence, Agility
        //
    }
    
    while (true) {
        // ns.clearLog()
        ns.print(playerStats.name + ' is currently at ' + playerStats.location + '.');
        ns.print(playerStats)
        if (trainingModuleBool) {
            ns.print("LETS GET TRAINED!")
            let wait = await trainCharacter()
            await ns.sleep(wait)
        }
        if (crimeModuleBool) {
            await updateChances();
            let best = await findBestCrime();
            let wait = await doCrime(best);
            if (wait > 0) {
            await ns.sleep(wait);
            }
        }
        await ns.sleep(1000);
    }
}