import { z } from "zod"

export const SpeakerSchema = z.object({
    id: z.string(),
    name: z.string(),
    photo: z.string().optional(),
})
export const SessionSchema = z.object({
    id: z.string(),
    name: z.string(),
    start: z.number(),
    end: z.number(),
    speakers: z.array(SpeakerSchema),
})

export const MOCK_SPEAKERS = [
    {
        id: "sarah",
        name: "Sarah Noon",
        photo: "https://xsgames.co/randomusers/assets/avatars/female/36.jpg"
    },
    {
        id: "arthur",
        name: "Arthur Pitt Neumann",
        photo: "https://xsgames.co/randomusers/assets/avatars/pixel/34.jpg"
    },
    {
        id: "flynn",
        name: "James Flynn",
    },
    {
        id: "jonathan",
        name: "Jonathan Green",
    },
    {
        id: "george",
        name: "George Bass",
        photo: "https://xsgames.co/randomusers/assets/avatars/pixel/0.jpg"
    },
    {
        id: "chidiebere",
        name: "Chidiebere Emery",
        photo: "https://xsgames.co/randomusers/assets/avatars/female/39.jpg"
    },
    {
        id: "maria",
        name: "Maria Nelson Luca de Witt",
    },
    {
        id: "andy",
        name: "Andy Nielson",
        photo: "https://xsgames.co/randomusers/assets/avatars/male/66.jpg"
    },
]

export const MOCK_SESSION = [{
    id: "buidl-the-buidlers_0",
    name: "Buidl the Buidlers",
    start: 1694248200000,
    end: 1694249400000,
    speakers: MOCK_SPEAKERS.slice(5)
}, {
    id: "buidl-the-buidlers_1",
    name: "How You Can Create the Next Generation of Web3 Contributors",
    start: 1694248200000,
    end: 1694249400000,
    speakers: MOCK_SPEAKERS.slice(3)
}, {
    id: "buidl-the-buidlers_2",
    name: "Buidl the Buidlers: How You Can Create the Next Generation of Web3 Contributors",
    start: 1694248200000,
    end: 1694249400000,
    speakers: MOCK_SPEAKERS.slice(2)
}, {
    id: "buidl-the-buidlers_3",
    name: "Buidl the Buidlers: How You Can Create the Next Generation of Web3 Contributors through Education, Peer Review, and Professional Development",
    start: 1694248200000,
    end: 1694249400000,
    speakers: MOCK_SPEAKERS
}]

