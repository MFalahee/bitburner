// import {addTableRow} from '/addTableRow.js'
/** @param {import(".").NS } ns */
export async function main(ns) {
    //first add scripts running on home
    //other ideas come later
    function addTableRow(heading, rows) {
        var HTMLEles = document.getElementsByTagName('tbody')
        var tableBody = HTMLEles[0]
        var currentTB = tableBody
        //clear existing nodes?
        var existing = tableBody.querySelectorAll('#tagged')
        // console.log(existing)
        // existing.forEach(ele => {
        //     ele.remove()
        // })

        //         var titleHead = document.createElement('th')
        //         var headingP = document.createElement('p')
        //         titleHead.setAttribute('class', "MuiTableRow-root css-u43k8v")
        //         titleHead.setAttribute("id", "tagged")
                
        //         headingP.setAttribute("id", "tagged")
        //         headingP.setAttribute('class', "MuiTypography-root MuiTypography-body1 jss11 css-1bubjwk")
        // headingP.textContent = heading
        // titleHead.appendChild(headingP);
        // currentTB.appendChild(titleHead)
        // rows.forEach((element) => {
        //             var row = document.createElement('tr')
        //             var rowP = document.createElement('p')
        //             row.setAttribute("class", "jss10 MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium css-hadb7u")
        //             row.setAttribute("id", "tagged")
        //             rowP.setAttribute("class", "MuiTypography-root MuiTypography-body1 jss12 css-f38fma")
        //             rowP.setAttribute("id", "tagged")
        //             rowP.textContent = element
        //             row.appendChild(rowP)
        //             currentTB.appendChild(row)
        // })
    }
    var scripts = ns.ps('home')
    var totalRam = ns.getServerMaxRam('home')
    var strings = []

    if (scripts && scripts.length > 0) {
        scripts.forEach(s => {
            var ram; var scriptString;
            ram = ns.nFormat(((ns.getScriptRam(s.filename) * s.threads)/totalRam), '0%')
            scriptString = `${s.filename} ${ram}`
            strings.push(scriptString)
        })
    }

    if (strings && strings.length > 0) {
        addTableRow("Scripts running: ", strings)
    }
}