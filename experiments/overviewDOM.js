// import {addTableRow} from '/addTableRow.js'
/** @param {import("..").NS } ns */
export async function main(ns) {
    var scripts = ns.ps('home')
    var totalRam = ns.getServerMaxRam('home')
    var strings = []
    var info = []
    var count = 0;
    var existing = document.querySelectorAll('#tagged')
    //first add scripts running on home
    //other ideas come later
    function addTableRow(heading, rows) {
        var count = 0
        var HTMLEles = document.getElementsByTagName('tbody')
        var tableBody = HTMLEles[0]
        var hR; var hH; var hP;
        

        // heading first
        if (heading) {
            hR = document.createElement('tr')
            hH = document.createElement('th')
            hP = document.createElement('p')
    
            // hR.setAttribute("class","MuiTableRow-root MuiTableCell-body MuiTableCell-sizeMedium css-hadb7u")
            hR.setAttribute("id", "tagged")
            hR.setAttribute("display",'inherit')
            // hH.setAttribute('class', "MuiTableRow-root css-u43k8v")
            hH.setAttribute("id", "tagged")
            hP.setAttribute('class', "MuiTypography-root MuiTypography-body1 jss11 css-1bubjwk")
            hP.setAttribute("id", "tagged")
            hP.textContent = heading
            //append!
            tableBody.appendChild(hR)
            hR.appendChild(hH)
            hH.appendChild(hP)
        }
        // 
        if (tableBody.children.length > 0 && rows && rows.length > 0) {
            rows.forEach(script => {
                var rR; var rP; var rH
                rR = document.createElement('tr')
                rH = document.createElement('th')
                rP = document.createElement('p')
                // rR.setAttribute("class", "jss10 MuiTableRow-root MuiTableCell-body MuiTableCell-sizeMedium css-hadb7u")
                rH.setAttribute('class', "MuiTableRow-root css-u43k8v")
                rH.setAttribute('scope', "row")
                rH.setAttribute('colspan', 2)
                rR.setAttribute("id", "tagged")
                rP.setAttribute("class", "MuiTypography-root MuiTypography-body1 jss12 css-f38fma")
                rH.setAttribute("id", "tagged")
                rP.setAttribute("id", `tagged`)
                rP.textContent = script
                rP.setAttribute('color', 'white')
                rR.appendChild(rH)
                rH.appendChild(rP)
                tableBody.appendChild(rR)
                count++
                info.push([script, count])
            })
        }
        return info
    }

    function updateRows(strings, info, heading) {
        // console.log("UPDATING ROWS")
        let count = 0
        // if they don't match a string?
        if (existing && existing.length > 0) {
            // console.log(existing)
            existing.forEach(ele => {
                if (ele.tagName === 'P' && ele.textContent != heading) {
                    strings[count] ? ele.textContent = strings[count] : ele.remove()
                    count++
                }   
            })
        }
    }

        if (scripts && scripts.length > 0) {
            scripts.forEach(s => {
                var ram; var scriptString;
                ram = ns.nFormat(((ns.getScriptRam(s.filename) * s.threads)/totalRam), '0%')
                scriptString = `${s.filename} ${ram}`
                strings.push(scriptString)
            })
        }

        updateRows(strings, info, "Scripts running: ")
        if (strings && strings.length > 0 && existing.length === 0) {
            info = addTableRow("Scripts running: ", strings)
        }
        
    // console.log(ns.getPlayer())
}