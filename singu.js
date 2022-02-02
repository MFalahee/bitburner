//now that we are in bitnode 4? we have access to singularity functions. Lets figure out a use for them.
//
/** @param {import(".").NS } ns */
export async function main(ns) {
    ns.disableLog('sleep');
    ns.tail();
    var startTime = new Date()
    var playerStats = ns.getPlayer()
    console.log(playerStats)
    var resetModuleBool = false;
    var crimeModuleBool = false;
    var trainingModuleBool = false;
    var crimes = ['Shoplift', 'Rob store', 'Mug someone', 'Larceny', 'Deal Drugs', 'Bond Forgery', 'Traffick illegal Arms', 'Homicide', 'Grand theft Auto', 'Kidnap and Ransom', 'Assassinate', 'Heist'];
    var chances = new Array(crimes.length, null)
    var stats = ['Charisma', 'Dexterity', 'Strength', 'Defense', 'Agility', 'Hacking'];
    var formulasBool = (ns.fileExists('Formulas.exe'));

    /** HELPER FUNCS 
     * 
     * 
     */

    function info(t, s) {
        if (t == 'MM') {
            return ns.getServerMaxMoney(s)
        }
        if (t == 'MA') {
            return ns.getServerMoneyAvailable(s)
        }
        if (t == 'MR') {
            return ns.getServerMaxRam(s)
        }
        if (t == 'UR') {
            return ns.getServerUsedRam(s)
        }
        if (t == 'NPR') {
            return ns.getServerNumPortsRequired(s)
        }
        if (t == 'RHL') {
            return ns.getServerRequiredHackingLevel(s)
        }
        if (t == 'SL') {
            return ns.getServerSecurityLevel(s)
        }
        if (t == 'MSL') {
            return ns.getServerMinSecurityLevel(s)
        }
    }

    function grabPlayerInfo(input, stat) {
        let playaPlay = ns.getPlayer()
        switch (input) {
            case 'EM':
                return playaPlay[`${stat.toLowerCase()}_exp_mult`]
            case 'MLT':
                return playaPlay[`${stat.toLowerCase()}_mult`]
            case 'EXPG':
                let sliced = stat.substring(0, 3);
                sliced[0].toUpperCase();
                let p = `work${sliced}ExpGained`
                return playaPlay[p]
            case 'EXP':
                return playaPlay[`${stat.toLowerCase()}_exp`]
        }
    }
    /**
     * RESET MODULE
     *    //do simple reset stuff
     *    //buy a router
     *    //rebuy stuff
     *    //root specific servers for factions
     */

    async function resetModule() {
        
    }


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
     *  // training assumes you are in Sector 12.
        // powerhouse gym, rothman university -- Leadership course for charisma
        // these functions will check stats and train character at the correct locations.
        // Switches stats automatically to the next one if you are at the max.
     * 
     */
    trainingModuleBool = await ns.prompt(`Load Training Module?`);
    var levelLimit = findLevelLimit();
    //this limit will need to be made variable based on multipliers found on the player stats object
    //based on exp mult-- something like:
    //limits - 50 - 100 - 250 - 400 - 1000
    // exp mults - 1 - 1.5 - 2 - 2.5 - >3
    crimeModuleBool = await ns.prompt(`Load Crime Module?`);

    function findLevelLimit() {
        let i = 0;
        let totalLimits = 0
        while (i < stats.length) {
            if (grabPlayerInfo('MLT', stats[i]) > 1) {
                levelLimit = levelLimit * grabPlayerInfo('MLT', stats[i])
                totalLimits += grabPlayerInfo('MLT', stats[i])
            }
            i++;
        }
        let avg = totalLimits/stats.length
        ns.print(`avg limit: ${avg}`)
        let limit = 50
            if (avg > 1.25) {
                limit = 100;
            }
            if (avg > 1.5){
                limit = 250;
            }
            if (avg > 2){
                limit = 400;
            }
            if (avg > 3){
                limit = 1000;
            }
        ns.print('level limit: ' + limit)
        return limit
    }


    async function updatePlayer() {
        playerStats = ns.getPlayer()
        console.log(playerStats)
        return
    }


    function findTargetExp(skill, limit) {
        //this uses skill mult instead of skill exp mult which is very weird
        updatePlayer();
        let exp = 0;
        let mult = grabPlayerInfo('MLT', skill);
        exp = ns.formulas.skills.calculateExp(limit, mult);
        return exp
    }


    async function train(stat, limit) {
        //stat is a skill (Agility) to train, limit is the level limit for the skill (100)
        let skill; 
        let skillTime;
        let ans;
        let str = stat.toLowerCase()
        switch (stat) {
            case 'Hacking':
                ans = ns.universityCourse('rothman university', 'Algorithms', true);
                skillTime = new Date();
                skill = str;
                break;
            case 'Charisma':
                ans = ns.universityCourse('rothman university', 'Leadership', true);
                skillTime = new Date();
                skill = str;
                break;
            default:
                ans = ns.gymWorkout('powerhouse gym', stat, true);
                skillTime = new Date();
                skill = str;
                break;
        }
        while (playerStats[str] < limit) {
            if (ns.isBusy() && ans) {
                ns.clearLog();
                let currentExp = grabPlayerInfo('EXP', skill);
                let targetExp = findTargetExp(stat, levelLimit);
                ns.print(`Currently training: ${stat}`)
                ns.print(`Target Exp: ${targetExp}`)
                ns.print(`Current Exp: ${currentExp}`)
                if (startTime && grabPlayerInfo('EXPG', stat) > 0) {
                    let currentRate = ns.nFormat(grabPlayerInfo('EXPG', stat) / ((new Date().getTime() - skillTime.getTime()) / 1000), '0,000.00')
                    ns.print(currentRate + ' experience per second');
                    ns.print(`Time to level: ${Math.floor((targetExp- currentExp) / currentRate)} seconds`)
                }
                await ns.sleep(10000)
            } else {
                ns.print(`Not Training: ${stat}`)
            }
        }
    }


    async function trainCharacter() {
        updatePlayer();
        let i = 0;
        while (i < stats.length) {
            let str = stats[i]
            let stat = playerStats[str.toLowerCase()]
            // ns.print(`${str}: ${stat}`)
            if (stat && stat < levelLimit) {
                await train(str, levelLimit);
            }
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
        //Make some sort of initialization check
        //Make sure we are in sector 12 for training
        // ns.print(`Busy: `, ns.isBusy() + ' :::: at ' + playerStats.location + '.');
        // ns.print(levelLimit)
        if (trainingModuleBool) {
            await trainCharacter()
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