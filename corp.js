/** @param {import(".").NS } ns */
export async function main(ns) {
	ns.tail();
	ns.clearLog();
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

	/// IDEAS FOR BUILDING LATER
	//
	//
	//
	//
	/*

	keep track of total # of employees and display the number every cycle

	*/
	// {
	// 	"loc": "Chongqing",
	// 	"size": 66,
	// 	"minEne": 0,
	// 	"maxEne": 110,
	// 	"minHap": 0,
	// 	"maxHap": 110,
	// 	"maxMor": 110,
	// 	"employees": ["saljdflaj", "jhliasdjh"]
	// 	"employeeProd": {
	// 		"Operations": 56218.29797133367,
	// 		"Engineer": 40080.32623753379,
	// 		"Business": 8754.062585613612,
	// 		"Management": 32970.71316689903,
	// 		"Research & Development": 0,
	// 		"Training": 0
	// 	}
	// }


	function getEmployeesWorking(offices, name, employeeCache) {
		var counter = 0;
		var currentEmployee, employeeList, totalEmployees = 0,
			employeesMoved = 0,
			employeesIgnored = 0
		var currentRatio, prevRatio, totalPower
		var jobsArr = ["Operations", "Engineer", "Business", "Management", "Research & Development", "Training"]
		//how am I going to choose to assign an employee to a job? Idc about stats or anything at this point.
		//an approximate ideal ratio for jobs? 10-7-3-8 Op Eng Bus Mngr maybe?
		ns.print(`======== lets get these lazy peons @ ${name} working! =======`)
		ns.print(`Looks like there are ${offices.length} offices to audit.`)

		while (counter < offices.length) {
			var currOffice = {
				...offices[counter]
			}
			// ns.print(`Current office is: ${currOffice.loc}`)

			employeeList = currOffice.employees
			totalEmployees += employeeList.length

			//get total power ratio
			jobsArr.forEach(job => {
				totalPower += currOffice.employeeProd[job]
			})
			// ns.print(currOffice)
			// ns.print(`Total power for this branch is: ${totalPower}`)
			// ns.print(`Current Employee tally: ${totalEmployees}`)
			
			totalPower = 0
			counter++
		}

		ns.print(`===== THERE ARE ${totalEmployees} FOLKS EMPLOYED AT ${name} =====`)
	}

	function grabOfficeData(divInfo, offInfo) {
		var temp2, temp3;
		temp3 = divInfo.name
		// ns.print("DIVISION = ", temp3, " with ", divInfo.cities.length, ' cities')
		divInfo.cities.forEach(city => {
			//grab office info from each division
			temp2 = ns.corporation.getOffice(divInfo.name, city);
			// ns.print(`${temp3} under investigation. Officeinfo.temp3 is ${offInfo.temp3} long, while there are 6 cities.`)
			// ns.print("Inside for Each --> ", city)
			// ns.print("temp3  === ", temp3)
			// ns.print("offInfo.temp3 === ", offInfo[temp3])
			// ns.print("offInfo.temp3.length === ", offInfo[temp3].length)


			//this replaces old info with new, in theory. 
			if (offInfo[temp3].length === divInfo.cities.length) offInfo[temp3].shift()
			offInfo[temp3].push(temp2)
		})
		return offInfo
	}

	while (true) {

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

		//now get office info, attached to division-- 
		ns.print(`=== Implementing through divisions for city-office data ===`)
		divisionInfo.forEach(div => {
			ns.print(`==== DIVISION ====`)
			temp2 = grabOfficeData(div, officeInfo);
			officeInfo = temp2;
		})

		divisionsArray.forEach(division => {
			ns.print("")
			ns.print("division ==== ", division)
			ns.print(`${officeInfo[division].length} offices accounted for currently.`)

			ns.print("")
			ns.print("")

			ns.print("Moving onto role delegation.")
		})

		// first solution is simply to assign jobless/training employees to jobs
		divisionsArray.forEach(division => {
			getEmployeesWorking(officeInfo[division], division)
		})
		await ns.sleep(1000)
	}
}