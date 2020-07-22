const https = require('https');
const nodemailer = require('nodemailer');
const keepAliveAgent = new https.Agent({ keepAlive: true, timeout: 60000 });
let htmlData = {testing:"working?"};
const sort = require('./sorting.js');
const date = new Date();
let prevMon = addDays(date, -5);
function addDays (date, days) {
        let dt = new Date(date);
        dt.setDate(dt.getDate() + days);
        return dt;
}
let dateString = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
let prevMonString = `${prevMon.getFullYear()}-${prevMon.getMonth()+1}-${prevMon.getDate()}`;
console.log('prevMond: ', prevMon);
console.log('prevMonString', prevMonString);


const options = {
    hostname: 'taxes.aall.net',
    port: 829,
    path:'/AALLInternalAPI/api/leaderboard?strStartDate=' + prevMonString + '&strEndDate=' + dateString,
    rejectUnauthorized: false,
    method: 'GET',
    agent: keepAliveAgent,
    headers: {
        'Authorization': 'Basic YWFsbGFwaTpmaWUhMjNqNQ==',
        'accept': '*/*'
    }
}

const messageOptions = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'aall@aall.net',
        pass: 'Absolute55'
    }
};

const transport = nodemailer.createTransport(messageOptions);

sendMessage = html => {
    transport.sendMail({
        from: 'aall@aall.net',
        to: ['jaime.gonzalez@aall.net'],
        subject: `Flips Leaderboard Weekly Winners - ${date}`,
        html: html,
        attachments: []
    }, (err, info) => {
        if (err) {
            console.log('smtp err', err);
        }
        else {
            console.log('smtp info', info);
        }
    })
}

// let data = () => {
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
                // console.log('parsedData:', parsedData);
                // console.log('final parsed Data:', parsedData);
                htmlData = parsedData;
                return htmlData;
            }
            catch (e) {
                console.log("from res.on(end) catch block", e.message);
            }
            finally {
                sendMessage(sort.sortReps(htmlData)+sort.sortOffice(htmlData)+sort.sortDataManager(htmlData));
            }
        });
    })
    .on('error', e => {
        console.error(`Got error: ${e.message}`)
    })
.end();
// }


// data();