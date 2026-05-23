import { json, Router } from "express";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { loadWebPage } from "../utils/loadDocs.mjs";
import { agent } from "../core/agent.mjs";
import { ChatMessage, ChatBox } from "./Model.mjs";
import vectorStore from "../core/agent-utils/vectorStore.mjs";

const router = Router();
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
});

async function generateStream({ messages }, onsteps) {
    const stream = await agent.stream({ messages }, {
        streamMode: "values",
    });

    for await (const step of stream) {
        const message = step.messages[step.messages.length - 1]

        if (message.content !== "" && message.type !== "human") {
            const data = {
                role: (message.type == 'ai') ? "assistant" : message.type,
                content: message.content
            };
            onsteps(data)
        }
    }
}

router.post("/load-document", async (req, res) => {
    const { name, url } = req.body;

    if (!url)
        return res.status(400).send({ message: "Bad request" });
    try {
        const docs = await loadWebPage(url, "p");

        if (docs.length == 0)
            return res.status(404).send({ message: "Loading page failed!" });

        const allSplits = await splitter.splitDocuments(docs);

        await vectorStore.addDocuments(allSplits);

        return res.status(201).send({ message: "success" })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "Internal Error" });
    }
});

router.post("/newchat", async (req, res) => {
    const { title } = req.body;

    if (!title)
        return res.status(400).status({ message: "Bad request." });
    try {
        let chatBox = ChatBox.build({
            idUser: 0,
            title,
        });
        chatBox = await chatBox.save();
        return res.status(201).send({ id: chatBox.dataValues.id });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "Internal Error" });
    }
});

router.post("/generate", async (req, res) => {
    const { messages } = req.body;

    if (!messages || !messages.length)
        return res.status(400).send({ message: "Bad request." });

    try {
        res.setHeader('Content-Type', 'application/stream+json');
        await generateStream({ messages }, (data) => {
            res.write(JSON.stringify(data));
        });
        return res.end();
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "Internal Error" });
    }
});

router.post("/chat/:id", async (req, res) => {
    const { message } = req.body;
    const { id } = req.params;

    if (!message || !message.role || !message.content)
        return res.status(400).send({ message: "Bad request." });

    try {
        let chatBox = await ChatBox.findByPk(id);

        if (!chatBox)
            return res.status(404).send({ message: "Chat history not found." })
        let messages = ChatMessage.build({
            ...message,
            ChatBoxId: chatBox.dataValues.id
        });
        await userMessage.save();
        res.setHeader('Content-Type', 'application/stream+json');
        await generateStream({ messages }, async (data) => {
            let message = ChatMessage.build({
                ...data,
                ChatBoxId: chatBox.dataValues.id,
                thinking: null
            });
            res.write(JSON.stringify(data));
            await message.save();
        });
        return res.end();
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "Internal Error" });
    }
});

router.get("/chat/:id", async (req, res) => {
    const { id } = req.params;

    try {
        let chatBox = await ChatBox.findByPk(id);

        if (!chatBox)
            return res.status(404).send({ message: "Chatbox not found." });
        return res.send({ chatBox });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "Internal Error" });
    }
});

router.get("/chat", async (req, res) => {
    try {
        let chatBoxes = await ChatBox.findAll({
            where: {
                idUser: 0
            }
        });

        return res.send(chatBoxes);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "Internal Error" });
    }
});

router.get("/history/:id", async (req, res) => {
    const { id } = req.params;

    try {
        let chatBox = await ChatBox.findByPk(id);
        if (!chatBox)
            return res.status(404).send({ message: "History not found." });
        let chatMessage = await ChatMessage.findAll({
            where: {
                ChatBoxId: id
            }
        });
        return res.status(200).send(chatMessage);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "Internal Error" });
    }
});


router.put("/chat/:msgId", (req, res) => {
    const { msgId } = req.params;

    return res.send({ message: "Updated!" });
});

router.delete("/history/:id", async (req, res) => {
    try {
        const { id } = req.params;

        let chatBox = await ChatBox.findByPk(id);

        if (!chatBox)
            return res.status(404).send({ message: "History not found." });
        await chatBox.destroy();
        return res.status(201).send({ message: `Chatbox (${chatBoxId}) deleted` });
    } catch (err) {
        return res.status(500).send({ err });
    }
    return res.send({ message: "History Deleted!" });
});

export default router;