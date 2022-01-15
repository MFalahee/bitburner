/** @param {NS} ns **/
export async function grabOfficeData(division, officeInfo) {
    ns.print(` ===== ${division.name} ======`)
    ns.print(` ===== CITIES ======`)
    var temp2, temp3;
    ns.print("INSIDE FUNC")
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