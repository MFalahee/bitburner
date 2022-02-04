/** @param {import("..").NS } ns */
export async function main(ns) {
    ns.disableLog('sleep')
    ns.tail()
    var exes;
    var keycache = {};
    var currentServer;
    var nextServer;
    var childrenServers;
    var serverList = ["home"];
    var tempServerList = []
    var serverSet = new Set();
    var terminalInput = document.getElementById("terminal-input")
    var key = {
        " ": null,
        "0": 48,
        "1": 49,
        "2": 50,
        "3": 51,
        "4": 52,
        "5": 53,
        "6": 54,
        "7": 55,
        "8": 56,
        "9": 57,
        "CTRL": 17,
        "DOWNARROW": 40,
        "ENTER": 13,
        "ESC": 27,
        "TAB": 9,
        "UPARROW": 38,
        'A': 65,
        'B': 66,
        'C': 67,
        'D': 68,
        'E': 69,
        'F': 70,
        'G': 71,
        'H': 72,
        'I': 73,
        'J': 74,
        'K': 75,
        'L': 76,
        'M': 77,
        'N': 78,
        'O': 79,
        'P': 80,
        'Q': 81,
        'R': 82,
        'S': 83,
        'T': 84,
        'U': 85,
        'V': 86,
        'W': 87,
        'X': 88,
        'Y': 89,
        'Z': 90,
    };
    async function scanExes() {
        for (let hack of ['brutessh', 'ftpcrack', 'relaysmtp', 'sqlinject', 'httpworm']) {
            if (ns.fileExists(hack + '.exe')) {
                exes.push(hack)
            }
        }
    }

    function createPressEvent(L) {
        L = L.toUpperCase();
        // ns.print(L)
        // ns.print(key[L])
        console.log(L)
        var kC = key[L]
        // console.log(kC)
        var sendInput = new InputEvent(L)
        if (L === " ") {
            var sendUp = new KeyboardEvent('keyup', {
                key: L,
                keyCode: kC,
                bubbles: true,
                ctrlKey: false,
            })
            var sendDown = new KeyboardEvent('keydown', {
                key: L,
                keyCode: kC,
                bubbles: true,
                ctrlKey: false,
            })
            return [sendDown, sendInput, sendUp]
        } else {
            var sendUp = new KeyboardEvent('keyup', {
                key: L,
                keyCode: kC
            })
            var sendDown = new KeyboardEvent('keydown', {
                key: L,
                keyCode: kC
            })
            return [sendDown, sendInput, sendUp]
        }
    }

    var pressEnter = new KeyboardEvent('keydown', {
        key: 'ENTER',
        bubbles: true,
        keyCode: 13
    })



    async function terminalType(string) {
        ns.print(string)
        let t = document.getElementById('terminal-input')
        t.focus()
        for (let o of string) {
            let event = createPressEvent(o);
            event.forEach(ev => {
                document.dispatchEvent(ev)
            })
            // window.dispatchEvent(event)
        }
    }

    async function terminalSR(server) {
        console.log(key)
        // connect -> backdoor --> wait
        //handle spaces!
        await terminalType(`connect ${server}`);
        await ns.sleep(10000);
        await terminalType(`backdoor`)
    }

    function sendClick() {
        let unclickable = document.getElementById('unclickable');
        let click = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        })

        ns.print(unclickable.dispatchEvent(click));
    }

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
                for (let hack of exes) {
                    ns[hack](node)
                };
                ns.nuke(node)
                //cue function that actually does terminal stuff
                await terminalSR(node)
            } else if (ns.hasRootAccess(node) && (ns.getServerRequiredHackingLevel(node) <= ns.getPlayer().hacking)) {
                // ns.print(`${node} is ready to be backdoored.`)
                await terminalSR(node);
            } else {
                ns.print(`Unable to backdoor ${node}`)
            }
        }
        set.add(node)
        while (list.length > 0) {
            //start case
            if (node === 'home') {
                list.pop();
                // ns.print("Initializing.")
                ns.scan('home').filter(server => !server.includes("SERVER")).forEach(server => {
                    list.push(server)
                })
            }

            let current = list.pop()

            if (ns.serverExists(current)) {
                ns.print(current)
                ns.scan(current).filter(server => !(set.has(server))).forEach(server => {
                    list.push(server)
                })
                await serverCrawl(current, list, set)
            } else {
                ns.print(`Something went wrong.`)
            }
        }
    }



    while (true) {
        ns.clearLog()
        exes = []
        // sendClick();
        await scanExes()
        ns.print(exes)
        await serverCrawl('home', [], serverSet);
        ns.print(serverSet)
        await ns.sleep(10000)
    }
}


/*
async function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): Promise<void> {
    // Run command.
    if (event.keyCode === KEY.ENTER && value !== "") {
      event.preventDefault();
      terminal.print(`[${player.getCurrentServer().hostname} ~${terminal.cwd()}]> ${value}`);
      terminal.executeCommands(router, player, value);
      saveValue("");
      return;
    }
*/