/** @param {NS} ns **/
export async function main(ns) {
    //takes in one argument, a division object. Sorts through the cities on the obj, and returns an array of office information for each city.
    var temp, temp2, temp3;
    var officeInfo = {
		"PogFarms": [1],
		"PogEats": [1],
		"PogPlaces": [1]
	}
    var division = arg[0];

    export function grabOfficeData(division, officeInfo) {
        ns.print(` ===== ${division.name} ======`)
        ns.print(` ===== CITIES ======`)
        division.cities.forEach(city => {
            temp3 = division.name
            //grab office info from each division
            temp2 = ns.corporation.getOffice(division.name, city);
            ns.print(temp3)
            ns.print(temp2)
            officeInfo.temp3.length === division.cities.length ? officeInfo.temp3.shift() : null
            officeInfo.temp3.push(temp2)
        })
        return officeInfo
    }
    return grabOfficeData(division, officeInfo)
}