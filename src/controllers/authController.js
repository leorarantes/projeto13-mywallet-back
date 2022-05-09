import db from "./../db.js";
import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

export async function signUp(req, res) {
    const userSchema = joi.object({
        email: joi.string().pattern(/^[a-z0-9]+@[a-z0-9]+\.[a-z]+/),
        name: joi.string().required(),
        password: joi.string().required()
    });
    const { error } = userSchema.validate(req.body);
    if (error) return res.sendStatus(422);

    const {email, name, password} = req.body;

    try {
        let user = await db.collection("users").findOne({email: email});
        if (user) return res.status(422).send("User already exists.");

        const SALT = 14;
        await db.collection("users").insertOne({ email: email, name: name, password: bcrypt.hashSync(password, SALT) });
        user = await db.collection("users").findOne({email: email});
        await db.collection("wallets").insertOne({ userId: user._id, entries: [] });
        
        res.sendStatus(201);
    } catch (error) {
        console.log("Error creating user.", error);
        res.status(500).send("Error creating user.");
    }
}

export async function signIn(req, res) {
    const userSchema = joi.object({
        email: joi.string().pattern(/^[a-z0-9]+@[a-z0-9]+\.[a-z]+/),
        password: joi.string().required()
    });
    const { error } = userSchema.validate(req.body);
    if (error) return res.sendStatus(422);

    const {email, password} = req.body;

    try {
        const user = await db.collection("users").findOne({ email: email });

        if (!user) return res.sendStatus(404);

        if (user && bcrypt.compareSync(password, user.password)) {
            const token = uuid();
            await db.collection("sessions").insertOne({ userId: user._id, token: token, lastStatus: Date.now() });
            
            delete user.password;
            res.send({...user, token: token});
        } else {
            res.sendStatus(404);
        }

    } catch (error) {
        console.log("Error logging in user.", error);
        res.status(500).send("Error logging in user.");
    }
}