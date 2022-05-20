import db from "../db.js";

export async function signOut(req, res) {
    try {
        const { user } = res.locals;
        await db.collection("sessions").deleteOne({ userId: user._id });

        res.sendStatus(201);
    } catch (error) {
    console.log("Error signing out.", error);
    res.status(500).send("Error signing out.");
    }
}