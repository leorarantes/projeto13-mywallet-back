import joi from "joi";

import db from "../db.js";

export async function setWallet(req, res) {
    const entrySchema = joi.object({
        date: joi.string().required(),
        value: joi.number().required(),
        title: joi.string().required(),
        type: joi.string().valid("credit", "debit")
    });
    const { error } = entrySchema.validate(req.body);
    if (error) return res.sendStatus(422);

    const entry = req.body;
    const { user } = res.locals;

    try {
        await db.collection("wallets").updateOne({ 
            userId: user._id 
        }, { $push: {entries: entry} });

        await db.collection("sessions").updateOne({ 
            userId: user._id 
        }, { $set: {lastStatus: Date.now()} });

        res.sendStatus(201);

    } catch (error) {
        console.log("Error creating new entry.", error);
        res.status(500).send("Error creating new entry.");
    }
}

export async function getWallet(req, res) {
    try {
        const { user } = res.locals;
        const wallet = await db.collection("wallets").findOne({ userId: user._id });

        await db.collection("sessions").updateOne({ 
            userId: user._id 
        }, { $set: {lastStatus: Date.now()} });

        res.status(200).send(wallet.entries);
    } catch (error) {
        console.log("Error recovering wallet.", error);
        res.status(500).send("Error recovering wallet.");
    }
}