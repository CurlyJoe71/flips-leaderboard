const https = require('https');
const http = require('http');
const keepAliveAgent = new https.Agent({ keepAlive: true, timeout: 60000 });
const port = 7581;
// const axios = require('axios');
let rawData;
let htmlData;

const requestHandler = (req, res) => {
    console.log(req.url);
    res.end('Hi. Got your request.');
}

const server = http.createServer(requestHandler);

server.listen(port, err => {
    if (err) {
        return console.log('something broke', err);
    }

    console.log('we\'re listening!');
})

const options = {
    hostname: 'taxes.aall.net',
    port: 829,
    path:'/AALLInternalAPI/api/leaderboard?strStartDate=2020-06-01&strEndDate=2020-06-30',
    rejectUnauthorized: false,
    method: 'GET',
    agent: keepAliveAgent,
    headers: {
        'Authorization': 'Basic YWFsbGFwaTpmaWUhMjNqNQ==',
        'accept': '*/*'
    }
}

https
.request(
    options,
    res => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];

        let err;
        if (statusCode !== 200) {
            err = new Error('Request Failed.\n' +
                            `Status Code: ${statusCode}`);
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
                console.log('\n\n\n parsedData:', parsedData);
                // console.log('final parsed Data:', parsedData);
                htmlData = parsedData;
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