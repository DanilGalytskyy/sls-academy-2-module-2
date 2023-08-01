import { nanoid } from "nanoid";
import { isValidLink } from "../utils/urls.js";
import Url from '../models/url.js'

export async function urlShorter(req, res) {
    const { originalUrl } = req.body;
    const base = process.env.BASE;
    const urlId = nanoid(5);
    if (isValidLink(originalUrl)) {
        try {
            let url = await Url.findOne({ originalUrl });
            if (url) {
                res.json(url.shortUrl);
            } else {
                const shortUrl = `${base}/${urlId}`;
                url = new Url({
                    originalUrl,
                    shortUrl,
                    urlId,
                    date: new Date(),
                });
                await url.save();
                res.json(shortUrl);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json('Server Error');
        }
    } else {
        res.status(400).json('Invalid Original URL');
    }
}

export async function urlFinder(req, res) {
    try {
        const url = await Url.findOne({ urlId: req.params.urlId });
        if (url) {
            await Url.updateOne({
                urlId: req.params.urlId,
            },
                { $inc: { clicks: 1 } }
            );
            return res.redirect(url.originalUrl);
        } else {
            res.status(404).json('Not found');
        }
    } catch (error) {
        console.log(error);
        res.status(500).json('Server Error');
    }
}