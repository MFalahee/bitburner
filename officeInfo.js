/** @param {NS} ns **/
async function grabOfficeData(division, officeInfo) {
    ns.clearLog()
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

export async function main(ns) {
    ns.print("=============== Inside MAIN!!!!!! ===================")
   return grabOfficeData(arg[0], arg[1])
}


//  interface Office {
//     /** City of the office */
//     loc: string;
//     /** Maximum number of employee */
//     size: number;
//     /** Minimum amount of energy of the employees */
//     minEne: number;
//     /** Maximum amount of energy of the employees */
//     maxEne: number;
//     /** Minimum happiness of the employees */
//     minHap: number;
//     /** Maximum happiness of the employees */
//     maxHap: number;
//     /** Maximum morale of the employees */
//     maxMor: number;
//     /** Name of all the employees */
//     employees: string[];
//     /** Positions of the employees */
//     employeeProd: EmployeeJobs;
//   }