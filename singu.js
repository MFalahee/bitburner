//now that we are in bitnode 4? we have access to singularity functions. Lets figure out a use for them.
//
/** @param {import(".").NS } ns */
export async function main(ns) {
        ns.disableLog('sleep');
        ns.tail();
        var startTime = new Date()
        var playerStats = ns.getPlayer()
        var crimeModuleBool = false;
        var trainingModuleBool = false;
        var crimes = ['Shoplift', 'Rob store', 'Mug someone', 'Larceny', 'Deal Drugs', 'Bond Forgery', 'Traffick illegal Arms', 'Homicide', 'Grand theft Auto', 'Kidnap and Ransom', 'Assassinate', 'Heist'];
        var chances = new Array(crimes.length, null)
        var stats = ['Charisma', 'Dexterity', 'Strength', 'Defense', 'Agility', 'Hacking'];
        var formulasBool = (ns.fileExists('Formulas.exe'));

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


        async function train(stat, limit) {
            //stat is a skill (Agility) to train, limit is the level limit for the skill (100)
            let skill;
            let ans;
            let str = stat.toLowerCase()


            if (formulasBool) {
                updatePlayer()
                var targetExp = ns.formulas.skills.calculateExp(limit, playerStats[`${str}_exp_mult`])
                var currentExp = playerStats[`${str}_exp`]
            }


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


            while (ns.getPlayer[str] < limit) {
                if (ns.isBusy() && ans) {
                    ns.print(`Currently training: ${stat}`)
                    ns.print(`Target Exp: ${targetExp}`)
                    ns.print(`Current Exp: ${currentExp}`)
                    if (startTime && playerStats[`work${str.substring(0,2)}ExpGained`] > 0) {
                        ns.print(Math.floor(player.workChaExpGained / ((new Date().getTime() - time.getTime()) / 1000)) + ' experience per second');
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