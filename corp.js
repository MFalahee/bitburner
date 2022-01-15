/** @param {import(".").NS } ns */
export async function main(ns) {
	ns.tail();

	var temp, temp2, temp3;
	var divisionsArray = ["PogFarms", "PogEats", "PogPlaces"];
	var divisionInfo = [{
		name: 'PogFarms'
	}, {
		name: 'PogEats'
	}, {
		name: "PogPlaces"
	}];
	var officeInfo = {
		"PogFarms": [1],
		"PogEats": [1],
		"PogPlaces": [1]
	};


	function grabOfficeData(division, officeInfo) {
		var temp2, temp3;
		ns.print("INSIDE FUNC")
		temp3 = division.name
		ns.print("DIVISION = ", temp3, " with ", division.cities.length, ' cities')
		division.cities.forEach(city => {
			//grab office info from each division
			temp2 = ns.corporation.getOffice(division.name, city);
			ns.print(`${temp3} under investigation. Officeinfo.temp3 is ${officeInfo.temp3} long, while there are 6 cities.`)
			if (officeInfo.temp3.length === division.cities.length) officeInfo.temp3.shift()
			officeInfo.temp3.push(temp2)
		})
		return officeInfo
	}

	while (true) {
		await ns.sleep(1000)
		// ns.clearLog();

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
			ns.print(`==== DIVISION ====`)
			temp2 = grabOfficeData(division, officeInfo);
			officeInfo = temp2;
			ns.print(officeInfo)
		})
	}
}