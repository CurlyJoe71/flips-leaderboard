const https = require('https');
const express = require('express');
const keepAliveAgent = new https.Agent({ keepAlive: true, timeout: 150000 });
const server = express();
const cors = require('cors');
// const { Server } = require('ws');
// const wss = new Server({ server });


const port = process.env.PORT || 7581;
let htmlData = {testing:"working?"};

server.use(cors());

const date = new Date();
const day = date.getDay();
let prevMon;
if(date.getDay() == 0) {
    prevMon = new Date().setDate(date.getDate() - 7);
}
else {
    prevMon = new Date().setDate(date.getDate() - day);
}

console.log('prevMon: ', prevMon);
function addDays (date, days) {
        let dt = new Date(date);
        dt.setDate(dt.getDate() + days);
        return dt;
}
let prevMonDate = new Date(prevMon);
let dateString = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
let prevMonString = `${prevMonDate.getFullYear()}-${prevMonDate.getMonth()+1}-${prevMonDate.getDate()}`;
// let prevMonString = '2020-07-20';

server.get('/', (req, res) => {
    data();
    setTimeout(() => {
        res.send(htmlData);
    }, 6000);
})

server.listen(port, err => {
    if (err) {
        return console.log('Uh oh. Broken...');
    } else {
        return console.log('Listening...' + port);
    }
})

const options = {
    hostname: 'taxes.aall.net',
    port: 829,
    // path:'/AALLInternalAPI/api/leaderboard?strStartDate=2020-07-01&strEndDate=2020-07-20',

    path:'/AALLInternalAPI/api/leaderboard?strStartDate=' + prevMonString + '&strEndDate=' + dateString,
    rejectUnauthorized: false,
    method: 'GET',
    agent: keepAliveAgent,
    headers: {
        'Authorization': 'Basic YWFsbGFwaTpmaWUhMjNqNQ==',
        'accept': '*/*'
    }
}

console.log('options path: ', options.path);

let data = () => {
    https
    .request(
        options,
        res => {
            const { statusCode } = res;
            const contentType = res.headers['content-type'];
    
            let err;
            if (statusCode !== 200) {
                err = new Error('Request Failed.\n' +
                                `Index Status Code: ${statusCode}`);
            }
            else if (!/^application\/json/.test(contentType)) {
                err = new Error('Invalid content-type.\n' +
                                    `Expected application/json but received ${contentType}`);
            }
            if (err) {
                console.error(err.message);
                res.resume();
                return;
            }
    
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', chunk => {
                rawData += chunk;
            });
    
            res.on('end', () => {
                try {
                    const newRawData = JSON.stringify(rawData)
                    const parsedData = JSON.parse(newRawData);
                    // console.log("incoming parsed Data", newRawData);
                    console.log('parsedData:', parsedData);
                    // console.log('final parsed Data:', parsedData);
                    htmlData = parsedData;
                    return htmlData;
                }
                catch (e) {
                    console.log("from res.on(end) catch block", e.message);
                }
            });
        })
    .on('error', e => {
        console.error(`Got error: ${e.message}`)
    })
    .end();
}


// const options = {
//     xhrFields: {
//         withCredentials: false
//     },
//     type: 'GET',
//     // beforeSend: (xhr) => {
//         //     xhr.setRequestHeader ("Authorization", "Basic YWFsbGFwaTpmaWUhMjNqNQ==")
//         // },
//     headers: {
//         'Authorization': 'Basic YWFsbGFwaTpmaWUhMjNqNQ=='
//     },
//     async: true,
//     dataType: 'jsonp',
//     crossDomain: true,
//     // dataFilter: (raw, type) => {
//         //     rawData += raw;
//         //     console.log('rawData: ', rawData);
//         //     console.log('dataType: ', type);
//         //     return raw;
//         // },
//     success: (data, x, y) => {
//         console.log('data recieved: ', data);
//         console.log('status: ', x);
//     },
//     error: (x, y, z) => {
//         console.log('error: ', y);
//     },
//     url:'https://taxes.aall.net:829/AALLInternalAPI/api/leaderboard?strStartDate=2020-06-01&strEndDate=2020-06-30'
// }

// function getData() {
//     $.ajax(options)
// }

// getData();

// $().ready(()=>{
// })