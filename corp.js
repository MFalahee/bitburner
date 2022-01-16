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

	var employeeCache = {}

	/// IDEAS FOR BUILDING LATER
	//
	//
	//
	//
	/*

	keep track of total # of employees and display the number every cycle

	*/
	/*{
		"loc": "Chongqing",
		"size": 66,
		"minEne": 0,
		"maxEne": 110,
		"minHap": 0,
		"maxHap": 110,
		"maxMor": 110,
		"employees": ["saljdflaj", "jhliasdjh"]
		"employeeProd": {
			"Operations": 56218.29797133367,
			"Engineer": 40080.32623753379,
			"Business": 8754.062585613612,
			"Management": 32970.71316689903,
			"Research & Development": 0,
			"Training": 0
		}
	}
	**/


	/* OFFICE FUNCs 
	===============================================================================
	*/

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



	function getEmployeesWorking(offices, name, employeeCache) {
		var c1 = 0,
			c2 = 0,
			c3 = 0
		var currentEmployee, employeeList, toMoveList
		var totalEmployees = 0,
			employeesMoved = 0,
			employeesIgnored = 0
		var currentRatio, prevRatio, totalPower,
			opPower, engPower, busPower, mngPower, resPower
		var jobsArr = ["Operations", "Engineer", "Business", "Management", "Research & Development", "Training"]
		//how am I going to choose to assign an employee to a job? Idc about stats or anything at this point.
		//an approximate ideal ratio for jobs? 10-7-3-8 Op Eng Bus Mngr maybe?
		ns.print(`======== lets get these lazy peons @ ${name} working! =======`)
		// ns.print(`Looks like there are ${offices.length} offices to audit.`)

		while (c1 < offices.length) {
			//RESETS FOR OFFICE

			var currOffice = {
				...offices[c1]
			}
			var tempPower = 0;
			totalPower = 0, c2 = 0; c3 = 0; toMoveList = []
			ns.print(`======= Current office is: ${currOffice.loc} ========`)
			ns.print(`==== SIZE: ${currOffice.size} ==== minENERGY: ${currOffice.minEne} ==== minHAPPINESS: ${currOffice.minHap}`)
			employeeList = currOffice.employees
			totalEmployees += employeeList.length

			//get total power ratio
			//probably a way to use the cascade of a switch in my favor here.
			// check ratio

			while (c2 < jobsArr.length) {
				var job = jobsArr[c2]
				// ns.print(currOffice.employeeProd)
				// ns.print(`job is: ${Math.floor(currOffice.employeeProd[job])} ${job}`)
				switch (job) {
					case "Training":
						break;
					case "Operations":
						opPower = Math.floor(currOffice.employeeProd[job])
						totalPower += opPower;
						break;
					case "Engineer":
						engPower = Math.floor(currOffice.employeeProd[job])
						totalPower += engPower
						break;
					case "Business":
						busPower = Math.floor(currOffice.employeeProd[job])
						totalPower += busPower
						break;
					case "Management":
						mngPower = Math.floor(currOffice.employeeProd[job])
						totalPower += mngPower
						break;
					case "Research & Development":
						resPower = Math.floor(currOffice.employeeProd[job])
						totalPower += resPower
						break;
					default:
						ns.print("This shouldn't happen! job is: ", job)
				}
				c2++
			}

			while (c3 < employeeList.length) {
				//quick loop to see who is training/unassigned and NEEDS to be moved.
				currentEmployee = ns.corporation.getEmployee(name, currOffice.loc, employeeList[c3])
				if (currentEmployee.pos === 'Unassigned' || currentEmployee.pos === 'Training') {
					toMoveList.push(currentEmployee)
				}
				c3++
			}

			var avgPower
			toMoveList ? avgPower = Math.floor(totalPower/(employeeList.length - toMoveList.length)) : null
			ns.print(`=== TOTAL PWR: ${totalPower} `)
			ns.print(`=== OP: ${opPower} == ENG: ${engPower} == BUS: ${busPower} == MNG: ${mngPower}`)
			ns.print(`This office has ${(toMoveList) ? toMoveList.length: null} employees to move`)
			ns.print(`On avg, each active employee provides: ${avgPower} power`)

			/* Now that we have all of the employee information and relative power, we need to sort through the unassigned employees 
			 relevant variables: opPower, engPower, busPower, mngPower, resPower, toMoveList, currentEmployee
			 Office obj - {loc, size, minEne, maxEne, minHap, maxHap, maxMor, employees, employeeProd}
			
			 interface Employee {
    				/** Name of the employee */
					// name: string;
					/** Morale */
					// mor: number;
					/** Happiness */
					// hap: number;
					/** Energy */
					// ene: number;
					// int: number;
					// cha: number;
					// exp: number;
					// cre: number;
					// eff: number;
					/** Salary */
					// sal: number;
					/** City */
					// loc: string;
					/** Current job */
					// pos: string;
					//   }

			/*

			size could be used to figure out an avg for totalPower and how many employees are in each category-- but we'd need to know how many are training b/c
			the employee data doesn't actually show how many are where.

			*/
			// ns.print(currOffice)
			// ns.print(`Total power for this branch is: ${totalPower}`)
			// ns.print(`Current Employee tally: ${totalEmployees}`)()
			c1++
		}

		ns.print(`===== THERE ARE ${totalEmployees} FOLKS EMPLOYED AT ${name} =====`)
	}

	/* ============================================================================ */

	while (true) {

		// ns.clearLog();

		var corporation = ns.corporation.getCorporation();
		/*	commented out for clarity in logs
		ns.print("===== CORPORATION INFORMATION =====")
		ns.print("===== NAME ===== ", corporation.name, " =====")
		ns.print("===== CASH ===== ", corporation.funds < 10000000000 ? corporation.funds : "LOTS!", " =====")
		ns.print("===== PRICE ===== ", corporation.sharePrice, " ====== ")
		 */

		ns.print("====== DIVISION INFO  =======")
		divisionsArray.forEach(division => {
			temp = ns.corporation.getDivision(division)
			/* commented out for clarity in logs
			ns.print(`====== NAME ===== ${temp.name} =====`)
			ns.print(`====== TYPE ===== ${temp.type} =====`)
			ns.print(`====== REVENUE ===== ${temp.thisCycleRevenue} =====`)
			ns.print(`====== EXPENSES ===== ${temp.thisCycleExpenses} =====`)
			ns.print(`====== RESEARCH ===== ${temp.research} =====`)
			ns.print(`====== FACILITIES IN  ${temp.cities.length} CITIES ====`)
			ns.print("\b") 
			*/

			//update division info
			divisionInfo.shift()
			divisionInfo.push(temp)
		})

		//now get office info, attached to division-- 
		// ns.print(`=== Implementing through divisions for city-office data ===`)
		divisionInfo.forEach(div => {
			// ns.print(`==== DIVISION ====`)
			temp2 = grabOfficeData(div, officeInfo);
			officeInfo = temp2;
		})

		/* commented out for clarity in logs
		divisionsArray.forEach(division => {
		
			ns.print("")
			ns.print("division ==== ", division)
			ns.print(`${officeInfo[division].length} offices accounted for currently.`)

			ns.print("")
			ns.print("")

			ns.print("Moving onto role delegation.")
			
		})
		*/

		// first solution is simply to assign jobless/training employees to jobs
		divisionsArray.forEach(division => {
			getEmployeesWorking(officeInfo[division], division)
		})
		await ns.sleep(1000)
	}
}