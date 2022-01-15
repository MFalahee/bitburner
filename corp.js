import grabOfficeData from 'officeInfo.js';
/** @param {NS} ns **/
export async function main(ns) {

	ns.clearLog();
	ns.tail();


	var temp, temp2, temp3;
	var divisionsArray = ["PogFarms", "PogEats", "PogPlaces"]
	var divisionInfo = [{
		name: 'PogFarms'
	}, {
		name: 'PogEats'
	}, {
		name: "PogPlaces"
	}];
	var officeInfo = {
		"PogFarms": [],
		"PogEats": [],
		"PogPlaces": []
	}

	// function moveFromTraining(employee) {

	// }

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
			ns.print(grabOfficeData(division))
		})
		ns.print(officeInfo);
	}
}