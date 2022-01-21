/** @param {import(".").NS } ns */
export async function main(id, heading, data) {
        var tableBody = document.getElementsByTagName('tbody')
        tableBody[0].append( 
        <tr 
            classNames = "MuiTableRow-root css-u43k8v"
            id = {id} >
                <th
                classNames = "jss10 MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium css-hadb7u" >
                    <p classNames="MuiTypography-root MuiTypography-body1 jss11 css-1bubjwk"> 
                        {heading} 
                    </p> 
                </th>
                {data.forEach((element) => {<th classNames="jss10 MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium css-hadb7u">
                            <p classNames="MuiTypography-root MuiTypography-body1 jss12 css-f38fma">
                                {element}
                            </p>
                        </th>
                    })}
        </tr>)
        }