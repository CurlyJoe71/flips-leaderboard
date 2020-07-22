let managersObj;
let officeArr;
let repsObj;
let managerTableData = [];
let officeTableData = [];
const { JSOM, JSDOM } = require('jsdom');
const { window } = new JSDOM("");
let $ = require('jquery')( window );

//manually assigned start date of July 13
let startDate = new Date('2020-07-13');
let startDay = startDate.getDate();
let minFlips = Math.floor(startDay * 0.2);
let messageHTMLReps = '<h4>Flips - CSR Winners</h4>';
let messageHTMLOffice = '<h4>Flips - Office Winners</h4>';
let messageHTMLManagers = '<h4>Flips - Managers Winners</h4>';

firstBy=(function(){function e(f){f.thenBy=t;return f}function t(y,x){x=this;return e(function(a,b){return x(a,b)||y(a,b)})}return e})();

module.exports.sortReps = function sortReps (data) {
    let success = JSON.parse(data).filter(flip => flip.Flipped === true)
        .sort((a, b) => a.Office.localeCompare(b.Office));
    // console.log('success flips: ', success);
    let fail = JSON.parse(data).filter(flip => flip.Flipped === false)
        .sort((a, b) => a.Office.localeCompare(b.Office));
    // console.log('failed opps', fail);

    repsObj = [];
    let j = 0;
    for (var i = 0; i < JSON.parse(data).length; i++) {
        // console.log('object.values', Object.values(managersObj));
        if($.inArray(JSON.parse(data)[i]["CSR"], repsObj.map(m=>m.CSR))<0 //&& JSON.parse(data)[i]["Manager"] !== "Unknown"
        ){
            repsObj[j] = {
                CSR:JSON.parse(data)[i]["CSR"], 
                Office:JSON.parse(data)[i]["Office"],
                Name:JSON.parse(data)[i]["EmployeeName"]
            };
            j++;
        }
    }

    // console.log('repsObj: ', repsObj);

    repsObj.map((r, i) => {
        repsObj[i] = [];
        repsObj[i].push(r.CSR)
        repsObj[i].push(getRepsCount(r.CSR, success));
        repsObj[i].push(getRepsCount(r.CSR, fail));
        repsObj[i].push(repsObj[i][1] + repsObj[i][2]);
        repsObj[i].push((repsObj[i][1] / repsObj[i][3]).toFixed(2));
        repsObj[i].push(r.Office);
        repsObj[i].push(r.Name);
    })
    
    // console.log('repsObj', repsObj);
    
    repsObj.sort(
        firstBy(function(a, b) {return b[4] - a[4]})
        .thenBy(function(a, b) {return b[1] - a[1]})
        )

        repsObj = repsObj.filter(min => min[3] >= minFlips);
        let topScores = repsObj.map(r => r[4]).filter((s, i, arr) => arr.indexOf(s) === i);
        console.log('topScores: ', topScores);

    for (let i = 0; i < repsObj.length; i++) {
        // console.log('starting table update', managerTableData[i][0]);
        if (repsObj[i][4] === topScores[0]) {
            messageHTMLReps +=
                `<table class="first-place" style="font-size:1.2rem;color:darkgreen">
                    <thead></thead>
                    <tbody>
                        <tr>
                            <td>1st Place</p>
                            <td scope='row' class='text-center'>${repsObj[i][0]}</td>
                            <td class='text-center'>${repsObj[i][6]}</td>
                            <td class='text-center'>${repsObj[i][1]} Flips</td>
                            <td class='text-center'>${repsObj[i][3]} Opps</td>
                            <td class='text-center'>${(repsObj[i][4] * 100).toFixed(0)}%</td>
                        </tr>
                    </tbody>
                </table>`
        }
    }
    for (let i = 0; i < repsObj.length; i++) {
        // console.log('starting table update', managerTableData[i][0]);
        if (repsObj[i][4] === topScores[1]) {
            messageHTMLReps +=
                `<table class="first-place" style="font-size:1.1rem;color:blue">
                    <thead></thead>
                    <tbody>
                        <tr>
                            <td>2nd Place</p>
                            <td scope='row' class='text-center'>${repsObj[i][0]}</td>
                            <td class='text-center'>${repsObj[i][6]}</td>
                            <td class='text-center'>${repsObj[i][1]} Flips</td>
                            <td class='text-center'>${repsObj[i][3]} Opps</td>
                            <td class='text-center'>${(repsObj[i][4] * 100).toFixed(0)}%</td>
                        </tr>
                    </tbody>
                </table>`
        }
    }
    for (let i = 0; i < repsObj.length; i++) {
        // console.log('starting table update', managerTableData[i][0]);
        if (repsObj[i][4] === topScores[2]) {
            messageHTMLReps +=
                `<table class="first-place" style="font-size:1rem;color:purple">
                    <thead></thead>
                    <tbody>
                        <tr>
                            <td>3rd Place</p>
                            <td scope='row' class='text-center'>${repsObj[i][0]}</td>
                            <td class='text-center'>${repsObj[i][6]}</td>
                            <td class='text-center'>${repsObj[i][1]} Flips</td>
                            <td class='text-center'>${repsObj[i][3]} Opps</td>
                            <td class='text-center'>${(repsObj[i][4] * 100).toFixed(0)}%</td>
                        </tr>
                    </tbody>
                </table>`
        }
    }
    // console.log('repsHTML: ', messageHTML);
    return messageHTMLReps;
}

module.exports.sortOffice = function sortOffice (data) {
    let success = JSON.parse(data).filter(flip => flip.Flipped === true)
        .sort((a, b) => a.Office.localeCompare(b.Office));
    // console.log('success flips: ', success);
    let fail = JSON.parse(data).filter(flip => flip.Flipped === false)
        .sort((a, b) => a.Office.localeCompare(b.Office));
    // console.log('failed opps', fail);

    officeArr = [];
    let j = 0;
    for (var i = 0; i < JSON.parse(data).length; i++) {
        // console.log('object.values', Object.values(managersObj));
        if($.inArray(JSON.parse(data)[i]["Office"], officeArr)<0 && JSON.parse(data)[i]["Manager"] !== "Unknown"){
            officeArr[j] = JSON.parse(data)[i]["Office"];
            j++;
        }
    }
    // console.log('officeArr:', officeArr);

    officeArr.map((o, i) => {
        officeTableData[i] = [];
        officeTableData[i].push(o)
        officeTableData[i].push(getOfficeCount(o, success));
        officeTableData[i].push(getOfficeCount(o, fail));
        officeTableData[i].push(officeTableData[i][1] + officeTableData[i][2]);
        officeTableData[i].push((officeTableData[i][1] / officeTableData[i][3]).toFixed(2));
        // console.log('officeTableData', officeTableData);
    })

    officeTableData.sort(
        firstBy(function(a, b) {return b[4] - a[4]})
        .thenBy(function(a, b) {return b[1] - a[1]})
    )

    let topScores = officeTableData.map(r => r[4]).filter((s, i, arr) => arr.indexOf(s) === i);
    // console.log('topScores: ', topScores);

    for (let i = 0; i < officeTableData.length; i++) {
        // console.log('starting table update', managerTableData[i][0]);
        if (officeTableData[i][4] === topScores[0]) {
            messageHTMLOffice +=
                `<table class="first-place" style="font-size:1.2rem;color:darkgreen">
                    <thead></thead>
                    <tbody>
                        <tr>
                            <td>1st Place</p>
                            <td scope='row' class='text-center'>${officeTableData[i][0]}</td>
                            <td class='text-center'>${officeTableData[i][1]} Flips</td>
                            <td class='text-center'>${officeTableData[i][3]} Opps</td>
                            <td class='text-center'>${(officeTableData[i][4] * 100).toFixed(0)}%</td>
                        </tr>
                    </tbody>
                </table>`
        }
    }
    for (let i = 0; i < officeTableData.length; i++) {
        // console.log('starting table update', managerTableData[i][0]);
        if (officeTableData[i][4] === topScores[1]) {
            messageHTMLOffice +=
                `<table class="first-place" style="font-size:1.1rem;color:blue">
                    <thead></thead>
                    <tbody>
                        <tr>
                            <td>2nd Place</p>
                            <td scope='row' class='text-center'>${officeTableData[i][0]}</td>
                            <td class='text-center'>${officeTableData[i][1]} Flips</td>
                            <td class='text-center'>${officeTableData[i][3]} Opps</td>
                            <td class='text-center'>${(officeTableData[i][4] * 100).toFixed(0)}%</td>
                        </tr>
                    </tbody>
                </table>`
        }
    }
    for (let i = 0; i < officeTableData.length; i++) {
        // console.log('starting table update', managerTableData[i][0]);
        if (officeTableData[i][4] === topScores[2]) {
            messageHTMLOffice +=
                `<table class="first-place" style="font-size:1.3rem;color:purple">
                    <thead></thead>
                    <tbody>
                        <tr>
                            <td>3rd Place</p>
                            <td scope='row' class='text-center'>${officeTableData[i][0]}</td>
                            <td class='text-center'>${officeTableData[i][1]} Flips</td>
                            <td class='text-center'>${officeTableData[i][3]} Opps</td>
                            <td class='text-center'>${(officeTableData[i][4] * 100).toFixed(0)}%</td>
                        </tr>
                    </tbody>
                </table>`
        }
    }
    return messageHTMLOffice;
}

module.exports.sortDataManager = function sortDataManager (data) {
    // console.log('starting sortData', data);
    let success = JSON.parse(data).filter(flip => flip.Flipped === true)
        .sort((a, b) => a.CSR.localeCompare(b.CSR));
    // console.log('success flips: ', success);
    let fail = JSON.parse(data).filter(flip => flip.Flipped === false)
        .sort((a, b) => a.CSR.localeCompare(b.CSR));
    // console.log('failed opps', fail);

    managersObj = [];
    let j = 0;
    for (var i = 0; i < JSON.parse(data).length; i++) {
        // console.log('object.values', Object.values(managersObj));
        if($.inArray(JSON.parse(data)[i]["Manager"], managersObj.map(m=>m.Manager))<0 && JSON.parse(data)[i]["Manager"] !== "Unknown"){
            managersObj[j] = {Manager:JSON.parse(data)[i]["Manager"], Office:JSON.parse(data)[i]["Office"]};
            j++;
        }
    }

    managersObj.map((m, i) => {
        managerTableData[i] = [];
        managerTableData[i].push(m.Manager)
        managerTableData[i].push(getManagerCount(m.Manager, success));
        managerTableData[i].push(getManagerCount(m.Manager, fail));
        managerTableData[i].push(managerTableData[i][1] + managerTableData[i][2]);
        managerTableData[i].push((managerTableData[i][1] / managerTableData[i][3]).toFixed(2));
        managerTableData[i].push(m.Office)
        // console.log('managerTable', managerTableData);
    })

    managerTableData.sort(
        firstBy(function(a, b) {return b[4] - a[4]})
        .thenBy(function(a, b) {return b[1] - a[1]})
    )
    
    let topScores = managerTableData.map(r => r[4]).filter((s, i, arr) => arr.indexOf(s) === i);
    // console.log('topScores: ', topScores);

    for (let i = 0; i < managerTableData.length; i++) {
        // console.log('starting table update', managerTableData[i][0]);
        if (managerTableData[i][4] === topScores[0]) {
            messageHTMLManagers +=
                `<table class="first-place" style="font-size:1.2rem;color:darkgreen">
                    <thead></thead>
                    <tbody>
                        <tr>
                            <td>1st Place</p>
                            <td scope='row' class='text-center'>${managerTableData[i][0]}</td>
                            <td class='text-center'>${managerTableData[i][1]} Flips</td>
                            <td class='text-center'>${managerTableData[i][3]} Opps</td>
                            <td class='text-center'>${(managerTableData[i][4] * 100).toFixed(0)}%</td>
                        </tr>
                    </tbody>
                </table>`
        }
    }
    for (let i = 0; i < managerTableData.length; i++) {
        // console.log('starting table update', managerTableData[i][0]);
        if (managerTableData[i][4] === topScores[1]) {
            messageHTMLManagers +=
                `<table class="first-place" style="font-size:1.1rem;color:blue">
                    <thead></thead>
                    <tbody>
                        <tr>
                            <td>2nd Place</p>
                            <td scope='row' class='text-center'>${managerTableData[i][0]}</td>
                            <td class='text-center'>${managerTableData[i][1]} Flips</td>
                            <td class='text-center'>${managerTableData[i][3]} Opps</td>
                            <td class='text-center'>${(managerTableData[i][4] * 100).toFixed(0)}%</td>
                        </tr>
                    </tbody>
                </table>`
        }
    }
    for (let i = 0; i < managerTableData.length; i++) {
        // console.log('starting table update', managerTableData[i][0]);
        if (managerTableData[i][4] === topScores[2]) {
            messageHTMLManagers +=
                `<table class="first-place" style="font-size:1rem;color:purple">
                    <thead></thead>
                    <tbody>
                        <tr>
                            <td>3rd Place</p>
                            <td scope='row' class='text-center'>${managerTableData[i][0]}</td>
                            <td class='text-center'>${managerTableData[i][1]} Flips</td>
                            <td class='text-center'>${managerTableData[i][3]} Opps</td>
                            <td class='text-center'>${(managerTableData[i][4] * 100).toFixed(0)}%</td>
                        </tr>
                    </tbody>
                </table>`
        }
    }
    return messageHTMLManagers;
}

getRepsCount = (rep, object) => {
    let c = 0;
    for (var i = 0; i < object.length; i++) {
        if (object[i].CSR === rep) {
            c++;
        }
    }
    return c;
}

getOfficeCount = (office, object) => {
    let c = 0;
    for (var i = 0; i < object.length; i++) {
        if (object[i].Office === office) {
            c++;
        }
    }
    return c;
}

getManagerCount = (manager, object) => {
    let c = 0;
    for (var i = 0; i < object.length; i++) {
        if (object[i].Manager === manager) {
            c++;
        }
    }
    return c;
}
