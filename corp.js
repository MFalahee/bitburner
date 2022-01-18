/** @param {import(".").NS } ns */
export async function main(ns) {
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
	//variables for module checks
	var corpCheck;
	var divisionCheck;
	var officeDisplayBool;
	var officeExpansionModuleBool;
	var officePurchased = false;
	var employeeCache = {}

	/// IDEAS FOR BUILDING LATER
	// 
	//
	//

	/*
	[ ] Keep track of upgrades/things purchased -- log them out itemized in a command window?  
	[x] rework aesthetics of the display
	*/ 


	//
	/*

[done]	keep track of total # of employees and display the number every cycle
		Buy warehouse upgrades as needed?
		Attempt to implement Warehouse API?
		Start-up Corporation/Industries automatically

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

	function getEmployeesWorking(offices, name, employeeCache, officeDisplayBool) {
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

		if (officeDisplayBool) {
			name === 'PogFarms' ? ns.print(`-=-=-=- DIVISION EMPLOYMENT PROTOCOL-=-=-=-`) : null
			ns.print(`-=--=-=- ${name} -=- ZUG ZUG -=-=-=-`)
		}
	

		while (c1 < offices.length) {
			//RESETS FOR EACH OFFICE
			var currOffice = {
				...offices[c1]
			}
			var tempPower = 0;
			totalPower = 0, c2 = 0;
			c3 = 0;
			toMoveList = []
			officeDisplayBool ? ns.print(`-=- OFFICE: ${currOffice.loc} SIZE: ${currOffice.size} -=-`): null 
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

			if (c1 === offices.length && officeDisplayBool) {
				ns.print(`-=-=-=- ${name} EMPLOYS ${totalEmployees} PEOPLE -=-=-=-`)
				ns.print(`-=-=-=- MOVED: ${employeesMoved} :: IGNORED: ${employeesIgnored} -=-=-=-`)
			}
		}
		/* ============================================================================ */
	}
	officeDisplayBool = await ns.prompt(`Activate Office info Display?`)
	officeExpansionModuleBool = await ns.prompt('Activate Office Expansion module?');

	function buyOfficeSpace(offices, name) {
		var smallestOffice = null,
			counter = 0,
			smallestOfficeLoc = ''
		while (counter < offices.length) {
			if (offices[counter].size < smallestOffice || smallestOffice === null) {
				smallestOffice = offices[counter].size
				smallestOfficeLoc = offices[counter].loc
			}
			counter++
		}
		// ns.print(`Attempting to upgrade from ${smallestOffice} employees to ${Math.floor((smallestOffice)/10) + smallestOffice} at ${smallestOfficeLoc}`)
		ns.corporation.upgradeOfficeSize(name, smallestOfficeLoc, Math.floor((smallestOffice) / 10))
		var j = ns.corporation.getOffice(name, smallestOfficeLoc)
		return [((j.size > smallestOffice) ? true : false), smallestOfficeLoc, Math.floor((smallestOffice) / 10)]
	}

	ns.tail()
	while (true) {
		ns.clearLog();

		var corporation = ns.corporation.getCorporation();
		if (corporation) {
			ns.print(`-=-=-=--=-=-=--=-=-=--=-=-=--=-=-=--=-=-=-`)
			ns.print(`-=-=-=--=-CORPORATION INFORMATION-=-=-=-=-`)
			// ns.print(`-=- NAME :: ${corporation.name}`)
			// ns.print(`-=-  CASH:: ${Math.floor(corporation.funds/1000000)}M -=-`)
			// ns.print(`-=-  STOCK :: ${Math.floor(corporation.sharePrice)/1000}K -=-`)

			ns.print(`-=-=-=-   DIVISION  -=-=-=-`)
			divisionsArray.forEach(division => {
				temp = ns.corporation.getDivision(division)

				// ns.print(`-=-=-=- NAME -=-=-=- ${temp.name} -=-=-=-`)
				// ns.print(`-=-=-=- TYPE -=-=-=- ${temp.type} -=-=-=-`)
				// ns.print(`-=-=-=- REVENUE -=-=-=- ${Math.floor(temp.thisCycleRevenue)} -=-=-=-`)
				// ns.print(`-=-=-=- EXPENSES -=-=-=- ${Math.floor(temp.thisCycleExpenses)} -=-=-=-`)
				// ns.print(`-=-=-=- RESEARCH -=-=-=- ${Math.floor(temp.research)} -=-=-=-`)
				// ns.print(`-=-=-=- CITIES -=-=-=- ${temp.cities.length} -=-=-=-`)
				// ns.print(`-=-=-=--=-=-=--=-=-=--=--=-=-=--=-=-=--=-=-=--=-=-`)

				//update division info
				divisionInfo.shift()
				divisionInfo.push(temp)
			})

			//now get office info, attached to division-- 
			// ns.print(`=== Implementing through divisions for city-office data ===`)
			divisionInfo.forEach(div => {
				// ns.print(`-=-=-=- DIVISION -=-=-=-`)
				temp2 = grabOfficeData(div, officeInfo);
				officeInfo = temp2;
			})

			/* commented out for clarity in logs
			divisionsArray.forEach(division => {
				ns.print(`${officeInfo[division].length} offices accounted for currently.`)})
 			*/
			divisionsArray.forEach(division => {
				officePurchased = [false]
				//currently only assigns employees that are jobless/unassigned
				getEmployeesWorking(officeInfo[division], division, employeeCache, officeDisplayBool)
				//buy an office upgrade if possible for the smallest office.
				if (officeExpansionModuleBool) {
					officePurchased = buyOfficeSpace(officeInfo[division], division)
					if (officePurchased[0] && officeDisplayBool) {
						ns.print(`${division} EXPANDED ${officePurchased[1]} BY ${officePurchased[2]} PEONS`)
					} else {
						officeDisplayBool ? ns.print(`-=-=-=- NEED $ FOR OFFICE UPG -=-=-=-`) : null
					}
				} else {
					ns.print("-=-=-=--=-=-=--=-=-=--=-=-=-")
				}
			})
		}
		await ns.sleep(1000)
	}
}