//now that we are in bitnode 4? we have access to singularity functions. Lets figure out a use for them.
//
/** @param {import(".").NS } ns */
export async function main(ns) {
        ns.disableLog('sleep');
        ns.tail();
        var startTime = new Date()
        var playerStats = ns.getPlayer()
        console.log(playerStats)
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

       
        function findMult(stat) {
            let mult = 1;
            mult = playerStats[`${stat.toLowerCase()}_mult`]
            return mult
        }
        function findExpMult(stat) {
            let expMult;
            expMult = playerStats[`${stat.toLowerCase()}_exp_mult`];
            if (expMult == null) { expMult = 1; }
            // ns.print(`${stat} exp mult: ${expMult}`);
            return expMult
        }

        function findExpGained(stat) {
            let sliced = stat.substring(0,3);
            sliced[0].toUpperCase();
            let input = `work${sliced}ExpGained`
            let expGained = playerStats[input];
            if (expGained == null) { expGained = 0; }
            return expGained
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
         * 
         */
        trainingModuleBool = await ns.prompt(`Load Training Module?`);


        var levelLimit = 150;
        //this limit will need to be made variable based on multipliers found on the player stats object
        //based on exp mult-- something like:
        //limits - 50 - 100 - 250 - 400 - 1000
        // exp mults - 1 - 1.5 - 2 - 2.5 - >3

        crimeModuleBool = await ns.prompt(`Load Crime Module?`);
        ns.print(levelLimit)

        async function updatePlayer() {
            playerStats = ns.getPlayer()
            console.log(playerStats)
            return
        }

        function findTargetExp(skill, limit) {
            //this uses skill mult instead of skill exp mult which is very weird
                updatePlayer();
                let exp = 0;
                let mult = findMult(skill);
                exp = ns.formulas.skills.calculateExp(limit, mult);
                return exp
        }
        async function train(stat, limit) {
            //stat is a skill (Agility) to train, limit is the level limit for the skill (100)
            let skill;
            let ans;
            let str = stat.toLowerCase()
            switch (stat) {
                case 'Hacking':
                    ans = ns.universityCourse('rothman university', 'Algorithms', true);
                    skill = str;
                    break;
                case 'Charisma':
                    ans = ns.universityCourse('rothman university', 'Leadership', true);
                    skill = str;
                    break;
                default:
                    ans = ns.gymWorkout('powerhouse gym', stat, true);
                    skill = str;
                    break;
            }
            while (playerStats[str] < limit) {
                    let count = 0;
                if (ns.isBusy() && ans) {
                    updatePlayer();
                    let currentExp = playerStats[`${str}_exp`]
                    let targetExp = findTargetExp(stat, levelLimit);
                    ns.print(`Currently training: ${stat}`)
                    ns.print(`Target Exp: ${targetExp}`)
                    ns.print(`Current Exp: ${currentExp}`)
                    if (startTime && findExpGained(stat) > 0) {
                        let currentRate = ns.nFormat(findExpGained(stat) / ((new Date().getTime() - startTime.getTime()) / 1000), '0,000.00')
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
            // training assumes you are in Sector 12.
            // powerhouse gym, rothman university -- Leadership course for charisma
            //this function will check stats and train character accordingly.
            //Stats to train: Charisma, Dexterity, Strength, Defence, Agility
            // ns.gymWorkout(gymName, stat, focus)
            // ns.universityCourse(universityName: string, courseName: string, focus?: boolean): boolean;
            let i = 0;
            while (i < stats.length) {
                let str = stats[i]
                let stat = playerStats[str.toLowerCase()]
                ns.print(`${str}: ${stat}`)
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