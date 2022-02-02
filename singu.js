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
    var stats = ['Charisma', 'Dexterity', 'Strength', 'Defence', 'Agility'];
    var FormulasBool = (ns.fileExists('Formulas.exe'));

    /**CRIME MODULE
     * 
     * 
     * 
     * 
     */

    async function updateChances() {
        let i = 0;
        while (i < crimes.length) {
            chances[i] = ns.getCrimeChance(crimes[i]);
            i++;
        }
    }
    async function doCrime(crime) {
        if (!ns.isBusy()) {
            ns.print(`Doing a ${crimes[crime]} job--`);
            return ns.commitCrime(crimes[crime])
        }
    }

    async function findBestCrime() {
        let i = 0;
        let best = 0;
        while (i < crimes.length) {
            //loop through', 'and find the furthest crime along the array with 100% chance and return it.
            if (chances[i] == 1) {
                best = i;
            }
            i++;
        }
        return best
    }

    /**TRAINING MODULE
     * 
     * 
     * 
     */
    trainingModuleBool = await ns.prompt(`Load Training Module?`);


    var levelLimit = 100;
    //this limit will need to be made variable based on multipliers found on the player stats object

    crimeModuleBool = await ns.prompt(`Load Crime Module?`);
    ns.print(levelLimit)
    async function updatePlayer() {
        playerStats = ns.getPlayer()
    }
    async function trainCharacter() {
        updatePlayer();
        // training assumes you are in Sector 12.
        // powerhouse gym, rothman university -- Leadership course for charisma
        //this function will check stats and train character accordingly.
        //Stats to train: Charisma, Dexterity, Strength, Defence, Agility
        // ns.gymWorkout(gymName, stat, focus)
        // ns.universityCourse(universityName: string, courseName: string, focus?: boolean): boolean;
        let i = 0;
        let ans = [false, '']
        while (i < stats.length) {
            let str = stats[i]
            let stat = playerStats[str.toLowerCase()]
            let targetExp = ns.calculateExp(levelLimit, playerStats[`${str.toLowerCase()}_exp_mult`])
            let currentExp = playerStats[`${str.toLowerCase()}_exp`]
            if (stat && stat < levelLimit) { //if stat is less than level limit, train it.
                
                /*             
                    ans = [ns.universityCourse('rothman university', 'Leadership', true), str]
                    ans = [ns.gymWorkout('powerhouse gym', 'Dexterity', true), str]
                    ans = [ns.gymWorkout('powerhouse gym', 'Strength', true), str]
                    ans = [ns.gymWorkout('powerhouse gym', 'Defence', true), str]
                    ans = [ns.gymWorkout('powerhouse gym', 'Agility', true), str]
                    hacking_exp: number;
                    strength_exp: number;
                    defense_exp: number;
                    dexterity_exp: number;
                    agility_exp: number;
                    charisma_exp: number;
                    hacking_mult: number;
                    strength_mult: number;
                    defense_mult: number;
                    dexterity_mult: number;
                    agility_mult: number;
                    charisma_mult: number;
                    hacking_exp_mult: number;
                    strength_exp_mult: number;
                    defense_exp_mult: number;
                    dexterity_exp_mult: number;
                    agility_exp_mult: number;
                    charisma_exp_mult: number;
                */

                switch (str) {
                    case 'Charisma':


                }

                // ns.calculateExp(skill: number, skillMult?: number): number;
                //ns.
            } else if (playerStats[stat] >= levelLimit || ans[0] === true) {
                continue
            }
            //now that we are training we need to check the player stats and interrupt training if they are at 100.

            i++
        }
    }

    /*** MAIN LOOP
     * 
     * 
     * 
     * 
     */
    while (true) {
        ns.print(`Busy: `, ns.isBusy() + ' :::: at ' + playerStats.location + '.');
        if (trainingModuleBool) {
            let wait = await trainCharacter()
            if (wait > 0) {
                await ns.sleep(wait)
            }
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