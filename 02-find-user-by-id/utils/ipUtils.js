import fs from 'fs';
import csv from 'csv-parser';

export function ipToLong(ip) {
    const parts = ip.split('.');
    const longInt = (parseInt(parts[0]) << 24) + (parseInt(parts[1]) << 16) + (parseInt(parts[2]) << 8) + parseInt(parts[3]);
    return longInt >>> 0;
}

export function longToIp(longInt) {
    return (
      (longInt >>> 24) + '.' +
      (longInt >> 16 & 255) + '.' +
      (longInt >> 8 & 255) + '.' +
      (longInt & 255)
    );
}

export function loadIpCountry(userLongIntIp) {
    return new Promise((resolve, reject) => {
        const ipDatabase = [];
        fs.createReadStream('ip_data.CSV').pipe(csv()).on('data', (row) => {
            if (row['0'] <= userLongIntIp && userLongIntIp <= row['16777215']) {
                ipDatabase.push({
                    from: row['0'],
                    to: row['16777215'],
                    country: row['-'],
                });
                resolve(ipDatabase);
            }
        }).on('end', () => {
            console.log('IP database loaded successfully.');
        }).on('error', (error) => {
            reject(error);
        });
    });
}
