/** @param {NS} ns **/
export async function main(ns) {
	ns.clearLog();
	ns.tail();

	var temp, temp2, temp3;
	var divisionsArray = ["PogFarms", "PogEats", "PogPlaces"]
	var divisionInfo = [{ name: 'PogFarms' }, { name: 'PogEats' }, { name: "PogPlaces" }];
	var officeInfo = { "PogFarms": [], "PogEats": [], "PogPlaces": [] }

	function moveFromTraining(employee) {

	}

	function grabOfficeData(division, officeInfo) {
		ns.print(` ===== ${division.name} ======`)
		ns.print(` ===== CITIES ======`)
		division.cities.forEach(city => {
			temp3 = division.name
			//grab office info from each division
			temp2 = ns.corporation.getOffice(division.name, city);
			ns.print(temp3)
			officeInfo.temp3.length > 0 ? officeInfo.temp3.shift() : null
			officeInfo.temp3.push(temp2)
		})
		return officeInfo
	}



	while (true) {
		await ns.sleep(1000)
		ns.clearLog();
		var corporation = ns.corporation.getCorporation();
		ns.print("===== CORPORATION INFORMATION =====")
		ns.print("===== NAME ===== ", corporation.name, " =====")
		ns.print("===== CASH ===== ", corporation.funds < 10000000000 ? corporation.funds : "LOTS!", " =====")
		ns.print("===== PRICE ===== ", corporation.sharePrice, " ====== ")

		ns.print("====== DIVISION INFO  =======")
		divisionsArray.forEach(division => {
			temp = ns.corporation.getDivision(division)
			ns.print(`====== NAME ===== ${temp.name} =====`)
			ns.print(`====== TYPE ===== ${temp.type} =====`)
			ns.print(`====== REVENUE ===== ${temp.thisCycleRevenue} =====`)
			ns.print(`====== EXPENSES ===== ${temp.thisCycleExpenses} =====`)
			ns.print(`====== RESEARCH ===== ${temp.research} =====`)
			ns.print(`====== FACILITIES IN  ${temp.cities.length} CITIES ====`)
			ns.print("\b")

			//update division info
			divisionInfo.shift()
			divisionInfo.push(temp)
		})

		//now get office info -- then start implementing solutions
		ns.print(`=== Implementing through divisions for city-office data ===`)
		divisionInfo.forEach(division => {
			grabOfficeData(division, officeInfo)
		})

		ns.print(officeInfo);
	}
	// ns.print(divisionInfo)
}