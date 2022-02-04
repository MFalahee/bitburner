//this script will find the shortest path to the target server, and then connect to it.
/** @param {import(".").NS } ns */
export async function main(ns) {
    ns.tail()
    //we'll have to use a stack to keep track of the path we've taken
    let targetServer = ns.args[0];
    ns.print(`Target server: ${targetServer}`);
    //we'll use this to keep track of the path we've taken
    let path = [];
    var found = false;
    let visited = {};

    async function findPath(arr, targetServer) {
        let current = arr.pop()
        visited[current] = true;
        let target = targetServer;

        if (current === target) {
            ns.print('....')
            found = true;
            arr.push(current);
            // ns.print(`Path: ${arr}`)
            return arr;
        }
        if (found === false && current !== undefined) {
            let servers = ns.scan(current);
            ns.print(servers)
            servers.forEach(async server => {
                if (!ns.getPurchasedServers().includes(server) && !visited[server]) {
                    if (arr[arr.length-1] !== current) {
                    arr.push(current);
                    }
                    arr.push(server)
                    ns.print(`Path: ${arr}`)
                    return findPath(arr, targetServer);
                }

                //
            })
        }
    }
    let answer = await findPath(['home'], targetServer);
    if (found) {
        ns.print(`Found path to ${targetServer}`);
    } else {
        ns.print(`Could not find path to ${targetServer}`);
    }
    return path
}