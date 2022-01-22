/** @param {import(".").NS } ns */
export async function main(ns) { 
    function info(t, s) {
		if (t == 'MM') {
			return ns.getServerMaxMoney(s)
		}
		if (t == 'MA') {
			return ns.getServerMoneyAvailable(s)
		}
		if (t == 'MR') {
			return ns.getServerMaxRam(s)
		}
		if (t == 'UR') {
			return ns.getServerUsedRam(s)
		}
		if (t == 'NPR') {
			return ns.getServerNumPortsRequired(s)
		}
		if (t == 'RHL') {
			return ns.getServerRequiredHackingLevel(s)
		}
		if (t == 'SL') {
			return ns.getServerSecurityLevel(s)
		}
		if (t == 'MSL') {
			return ns.getServerMinSecurityLevel(s)
		}
	}

}