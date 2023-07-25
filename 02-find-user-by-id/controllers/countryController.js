import { ipToLong, loadIpCountry, longToIp } from "../utils/ipUtils.js";

export async function findUserCountryByIp(req, res) {
    try {
        const userIp = req.query.ip;
        const userLongIntIp = ipToLong(userIp);
        console.log(userLongIntIp);
        const result = await loadIpCountry(userLongIntIp);
        if (result.length > 0) {
            const matchedRow = result[0];
            const addressRangeStart = longToIp(parseInt(matchedRow.from));
            const addressRangeEnd = longToIp(parseInt(matchedRow.to));
            res.json({
                ip: userIp,
                country: matchedRow.country,
                addressRange: `${addressRangeStart} - ${addressRangeEnd}`,
            });
        } else {
            res.status(404).json({ error: 'Country not found for the given IP address.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
}
