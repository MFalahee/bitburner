/** @param {import(".").NS } ns */
export async function findServer(ns) {
    ns.tail()
    ns.disableLog('scan')
    //we'll have to use a stack to keep track of the path we've taken
    let targetServer = ns.readPort(1)
    ns.print(`Target server: ${targetServer}`);
    //we'll use this to keep track of the path we've taken
    let answer = await findPath(ns, 'home', targetServer);
    if (answer != null) {
            return (answer.reverse());
        }
    return null;
}

export async function backtrace(parent, start, end) {
    //we'll have to use a stack to keep track of the path we've taken
    let path = [];
    let visited = {};

    //we'll use this to keep track of the path we've taken
    let current = end;
    while (current != start) {
        path.push(current);
        visited[current] = true;
        current = parent[current];
    }
    path.push(start);
    return path;
}

export async function findPath(ns, start, end) {
    let parent = {}
    let queue = []
    ns.print(`Start: ${start}`);
    ns.print(`End: ${end}`);
    queue.push(start);
    while (queue.length > 0) {
        let current = queue.shift();
        if (current == end) {
            ns.print("FOUND PATH");
            return backtrace(parent, start, end)
        }

        let neighbors = ns.scan(current)
        for (let x in neighbors) {
            if (!queue.includes(current)) {
                parent[neighbors[x]] = current;
                queue.push(neighbors[x]);
            }
        }
    }
}