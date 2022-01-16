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


	/* OFFICE FUNCs 
	===============================================================================
	*/

	function grabOfficeData(divInfo, offInfo) {
		var temp2, temp3;
		temp3 = divInfo.name
		divInfo.cities.forEach(city => {
			//grab office info from each division
			temp2 = ns.corporation.getOffice(divInfo.name, city);
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
		var researchMode = false;
		var currentRatio, prevRatio, totalPower,
			opPower, engPower, busPower, mngPower, resPower
		var jobsArr = ["Operations", "Engineer", "Business", "Management", "Research & Development", "Training"]
		var employeeStats = ['int', 'cha', 'cre', 'eff']
		ns.print(`========DIVISION EMPLOYMENT PROTOCOL===================================`)
		ns.print(`======== ${name} ==== lets get these lazy peons working! =======`)

		while (c1 < offices.length) {
			// ns.clearLog()
			//RESETS FOR EACH OFFICE
			var currOffice = {
				...offices[c1]
			}
			var tempPower = 0;
			totalPower = 0, c2 = 0;
			c3 = 0;
			toMoveList = []
			ns.print(`-=- OFFICE:${currOffice.loc} SIZE: ${currOffice.size} -=-`)
			employeeList = currOffice.employees
			totalEmployees += employeeList.length
			while (c2 < jobsArr.length) {
				//RESETS FOR EACH JOB TYPE
				var job = jobsArr[c2]
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
						ns.print("This shouldn't happen! JOB SWITCH CASE ERROR. job is: ", job)
				}
				c2++
			}

			while (c3 < employeeList.length) {
				//quick loop to see who is training/unassigned and NEEDS to be moved in each office. var toMoveList is reset for each office and NOT stored across offices
				currentEmployee = ns.corporation.getEmployee(name, currOffice.loc, employeeList[c3])
				if (currentEmployee.pos === 'Unassigned' || currentEmployee.pos === 'Training') {
					toMoveList.push(currentEmployee)
				} else {
					employeesIgnored++
					employeeCache[currentEmployee.name] = {
						...currentEmployee
					}
				}
				c3++
			}

			var powerInd = {
				'opPower': opPower,
				'engPower': engPower,
				'busPower': busPower,
				'mngPower': mngPower,
				'resPower': resPower,
				'totalPower': totalPower
			}


			var avgPower, employeesWorking, employeeDist = [],
				career
			toMoveList ? employeesWorking = (employeeList.length - toMoveList.length) : employeesWorking = employeeList.length
			avgPower = Math.floor(totalPower / employeesWorking)

			//find correct employee ratios
			Object.keys(powerInd).forEach(key => {
				var currentCount, temp = 0;
				// ns.print(`=== the current Department is: ${key} ===`)
				key != 'totalPower' ? currentCount = Math.round(powerInd[key] / avgPower) : null
				// ns.print(`${currentCount} employees working in ${key}`)
				//Now we apply the ratio... TEMP = #of employees NEEDED TO FILL TO HIT RATIO, store in powerInd[key] as temp
				switch (key) {
					case 'opPower':
						temp = (Math.floor(currOffice.size * 0.3) - currentCount)
						break;
					case 'engPower':
						temp = (Math.floor(currOffice.size * 0.3) - currentCount)
						break;
					case 'busPower':
						temp = (Math.floor(currOffice.size * 0.1) - currentCount)
						break;
					case 'mngPower':
						temp = (Math.floor(currOffice.size * 0.3) - currentCount)
						break;
					case 'resPower':
						break;
					case 'totalPower':
						break;
				}

				powerInd[key] = [powerInd[key], currentCount, temp]
				// ns.print(`--- ${currentEmployee.name} --- ${Math.floor(highSkill)} ${SkillName} ${Math.floor(lessHighSkill)} ${SkillName2} ---`)
				// ns.print(powerInd[key])
			})

			// ns.print(`==================== CHECKING powerInd ==================`)
			// ns.print(powerInd["opPower"][0])
			// ns.print(powerInd["opPower"][1])
			// ns.print(powerInd["opPower"][2])
			// ns.print(powerInd["opPower"])
			// ns.print(powerInd)
			// ns.print(`========================================================`)

			if (toMoveList) {

				while (toMoveList.length > 0) {
					var highSkill = 0,
						lessHighSkill = 0,
						SkillName, SkillName2
					currentEmployee = toMoveList.pop()
					employeeStats.forEach(stat => {
						if (currentEmployee[stat] > highSkill) {
							highSkill = currentEmployee[stat]
							SkillName = stat
						} else if (currentEmployee[stat] <= highSkill && currentEmployee[stat] > lessHighSkill) {
							lessHighSkill = currentEmployee[stat]
							SkillName2 = stat
						}
					})

					// this is some bullshit but I'm lost on a better way currently
					switch (SkillName) {
						case 'int':
							if (researchMode) {
								//send scientists!
							} else {
								switch (SkillName2) {
									case "cha":
										career = "M"
										//manager
										break
									case "cre":
										career = "En"
										//engineer
										break
									case "eff":
										career = "Op"
										//operations
										break
								}
							}
							break
						case 'cha':
							switch (SkillName2) {
								case "int":
									career = "M"
									// manager
									break
								case "cre":
									career = "B"
									// business
									break
								case "eff":
									career = "B"
									// business
									break
							}
							break
						case 'cre':
							switch (SkillName2) {
								case "cha":
									career = "B"
									// business
									break
								case "int":
									career = "B"
									// business
									break
								case "eff":
									career = "Op"
									// operations
									break
							}
							break
						case 'eff':
							switch (SkillName2) {
								case "cha":
									career = "M"
									// manager
									break
								case "cre":
									career = "En"
									// engineer
									break
								case "int":
									career = "Op"
									// operations
									break
							}
							break
					}


					var blah
					// we cascade assign here
					switch (career) {
						case "B":
							if (powerInd['busPower'][2] > 0) {
								// ns.print(`Assigning ${currentEmployee.name} to Business`)
								employeesMoved++
								ns.corporation.assignJob(name, currOffice.loc, currentEmployee.name, "Business")
								powerInd['busPower'][2]--
								break
							}
							case "Op":
								if (powerInd["opPower"][2] > 0) {
									// ns.print(`Assigning ${currentEmployee.name} to Operations`)
									employeesMoved++
									ns.corporation.assignJob(name, currOffice.loc, currentEmployee.name, "Operations")
									powerInd["opPower"][2]--
									break
								}
								case "En":

									if (powerInd["engPower"][2] > 0) {
										// ns.print(`Assigning ${currentEmployee.name} to Engineering`)
										employeesMoved++
										ns.corporation.assignJob(name, currOffice.loc, currentEmployee.name, "Engineer")
										powerInd["engPower"][2]--
										break
									}
									case "M":
										if (powerInd["mngPower"][2] > 0) {
											// ns.print(`Assigning ${currentEmployee.name} to Management`)
											employeesMoved++
											ns.corporation.assignJob(name, currOffice.loc, currentEmployee.name, "Management")
											powerInd["mngPower"][2]--
											break
										}
										case "Re":
											if (powerInd['resPower'][2] > 0) {
												// ns.print(`Assigning ${currentEmployee.name} to Research`)
												employeesMoved++
												ns.corporation.assignJob(name, currOffice.loc, currentEmployee.name, "Research & Development")
												powerInd['resPower'][2]--
												break
											}
					}

				}
				c1++
			}

		if (c1 === offices.length) {
			ns.print(`===== THERE ARE ${totalEmployees} FOLKS EMPLOYED AT ${name} =====`)
			ns.print(`======= WE MOVED ${employeesMoved} EMPLOYEES THIS CYCLE ==========`)
			ns.print(`======= WE LET ${employeesIgnored} CHILL =======`)
		}
		}
		/* ============================================================================ */
	}
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
		// ns.print(`=== Implementing through divisions for city-office data ===`)
		divisionInfo.forEach(div => {
			// ns.print(`==== DIVISION ====`)
			temp2 = grabOfficeData(div, officeInfo);
			officeInfo = temp2;
		})

		/* commented out for clarity in logs
		divisionsArray.forEach(division => 
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
			getEmployeesWorking(officeInfo[division], division, {})
		})
		await ns.sleep(1000)
	}
}