/** @param {import(".").NS } ns */
export async function main(ns) {
    ns.tail()
    var exes;
    var currentServer;
    var nextServer;
    var childrenServers;
    var serverList = ["home"];
    var tempServerList = []
    var serverSet = new Set();
    var terminalInput = document.getElementById("terminal-input")


    async function scanExes() {
        for (let hack of ['brutessh', 'ftpcrack', 'relaysmtp', 'sqlinject', 'httpworm']) {
            if (ns.fileExists(hack + '.exe')) {
                exes.push(hack)
            }
        }
    }

    // let pressEnter = new Event("keypress", e => {

    // })


    async function serverCrawl(node, list, set) {
        if (list.length === 0 && !node === 'home') {
            return null
        }

        if (node === 'home') {
            list.push('home');
            //don't need to run root stuff on home.
        } else {
            //check access, and req hacking level against players own level
            if (!ns.hasRootAccess(node) && (ns.getServerRequiredHackingLevel(node) <= ns.getPlayer().hacking)) {
                //execute port unlocks if we have them
                for (let hack of exes) {
                    ns[hack](node)
                };
                ns.nuke(node)
                //cue function that actually types backdoor command
                await terminalType(node)
            } else if (ns.hasRootAccess(node) && (ns.getServerRequiredHackingLevel(node) <= ns.getPlayer().hacking)) {
                ns.print(`${node} is ready to be backdoored.`)
                await terminalType(node);
            } else {
                ns.print(`Unable to backdoor ${node}`)
            }
        }
        set.add(node)
        while (list.length > 0) {
            //start case
            if (node === 'home') {
                list.pop();
                ns.scan('home').filter(server => !server.includes("SERVER")).forEach(server => {
                    list.push(server)
                })

                let current = list.pop()

                if (ns.serverExists(current)) {
                    ns.print(`${current} is the next server to inspect.`)
                    ns.scan(current).filter(server => !set.has(server)).filter(server => !server.includes("SERVER")).forEach(server => {
                        list.push(server)
                    })
                    await serverCrawl(current, list, set)
                } else {
                    ns.print(`Something went wrong.`)
                }
            }
        }
    }

    async function terminalType(server) {
        await ns.tprint(`TRYING connect ${server}`)
        terminalInput.value = `connect ${server}`
        await ns.sleep(1000)
        terminalInput.submit();
        await ns.sleep(5001)
        await ns.sleep(5002)
        ns.print(`type type type`)

    }

    while (true) {
        exes = []
        await scanExes()
        await serverCrawl('home', [], serverSet);
        ns.print(serverSet)
        await ns.sleep(1000)
    }
}