/** @param {NS} ns **/
async function grabOfficeData(division, officeInfo) {
    ns.clearLog()
    ns.print(` ===== ${division.name} ======`)
    ns.print(` ===== CITIES ======`)
    var temp2, temp3;

    division.cities.forEach(async city => {
        temp3 = division.name
        //grab office info from each division
        temp2 = await ns.corporation.getOffice(division.name, city);
        ns.print(temp3)
        ns.print(temp2)
        (officeInfo.temp3.length === division.cities.length) ? officeInfo.temp3.shift() : null
        officeInfo.temp3.push(temp2)
    })
    return officeInfo
}

export async function main(ns) {
    ns.print("=============== Inside MAIN!!!!!! ===================")
   return grabOfficeData(arg[0], arg[1])
}

