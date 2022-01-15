/** @param {import(".").NS } ns */
export async function main(ns) {
	ns.tail()
	ns.clearLog()
	//alt + w goes to city
	ns.print('Criming, crime lord')
	var crime = document.getElementsByClassName("MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButtonBase-root  css-13ak5e0")
	var crimes = ['Shoplift',
		'Rob store',
		'Mug someone',
		'Larceny',
		'Deal Drugs',
		'Bond Forgery',
		'Traffick illegal Arms',
		'Homicide',
		'Grand theft Auto',
		'Kidnap and Ransom',
		'Assassinate',
		'Heist'];
	var click = new MouseEvent('click')
	var i = 0;
	while (i < crime.length) {
		ns.print(crime[i].getAttribute('id'));
		ns.print(crime[i].getAttribute('name'))
		ns.print('i=', i);
		if (crime[i].innerHTML.includes("Shoplift")) {
			// crime[i].click();
			// crime[i].dispatchEvent(click);
			crime[i].addEventListener('click', e => {
				ns.print('clicked at t1');
			}) 
		}
		else {
			await ns.sleep(1000)
		}
		i++
	}
	await ns.sleep(5000)

}