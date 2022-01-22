/** @param {import(".").NS } ns */
export async function main(ns) {
    ns.disableLog('ALL')
    var file = ['foodnstuff.js'];
    var exclude = [''] //Servers names that won't be used as hosts or deleted
    var servers;
    var hosts;
    var targets;
    var exes;
    var tarIndex;
    var loop;
    var hType;
    var netManager = false;
    var serverManager = false;
    var tmp;
    var act;
    var threadCount = 0;

    if (false) {
        brutessh();
        ftpcrack();
        relaysmtp();
        httpworm();
        sqlinject()
    }

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
    const arraySort = (arr) => arr.sort((a, b) => b[0] - a[0])

    //crawl servers
    //copy xp script over to server
    //calculate how many threads will fit
    //run scripts
    //continue crawl
    async function scanExes() {
        for (let hack of ['brutessh', 'ftpcrack', 'relaysmtp', 'sqlinject', 'httpworm']) {
            if (ns.fileExists(hack + '.exe')) {
                exes.push(hack)
            }
        }
    }

    async function scanServers(host, current) {
        //scan current
        for (let server of ns.scan(current)) {
            //for each adjacent server-- check if it's hackable, or on our list of purchased servers
            if ((ns.getPurchasedServers().includes(server) || info('NPR', server) <= exes.length) && host != server) {
                if (!ns.getPurchasedServers().includes(server)) {
                    for (let hack of exes) {
                        ns[hack](server)
                    }
                    ns.nuke(server)
                }
                if (info('MR', server) > 4 && !exclude.includes(server)) {
                    hosts.push([info('MR', server), server]);
                    hosts = arraySort(hosts)
                }
                servers.push(server)
                //copy file over
                await ns.scp(file, 'home', server)
                //move onto scan next servers
                await scanServers(current, server)
            }
        }
    }

    async function activateScript() {
        var totalThreads = 0
        var scriptRam = ns.getScriptRam(file[0])
        ns.print(`${file[0]} is ${scriptRam} RAM`)
        for (let host of hosts) {
            //check if running
            //if not activate
            //else continue to next host
            var ram = host[0];
            var name = host[1];
            var threads = 0;
            if (!ns.scriptRunning(file[0], name)) {
                ns.scriptKill('ALL', name)
                threads = (ram / scriptRam)
                ns.exec(file[0], name, threads)
                totalThreads += threads
            } else if (ns.scriptRunning(file[0], name)) {
                if ((ram - info('UR', name)) >= scriptRam) {
                    ns.exec(file[0], name, Math.floor((ram - info('UR', name)/scriptRam)))
                    totalThreads += Math.floor((ram - info('UR', name)/scriptRam))
                }
            }
        }
        ns.print(`Scripts activated on all servers`)
        return totalThreads
    }

    ns.tail()
    while (true) { //Keeps everything running once per second 
        servers = [];
        targets = [];
        hosts = [
            [info('MR', 'home'), 'home']
        ];
        exes = []
        tarIndex = 0;
        loop = false;
        act = {}
        await scanExes()
        await scanServers('', 'home')
        threadCount += await activateScript()
        ns.print(`Threads running currently: ${threadCount}`)
        ns.print(`For a total of ${(ns.getScriptExpGain(file[0], 'home'))*threadCount} experience`)
        // await hackAll()
        await ns.asleep(1000)
    }
}