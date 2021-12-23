interface IAccessUser {
    id: number,
    name: string,
    photo: string
}

interface IFakeData {
    id: number,
    title: string,
    category: string,
    status_running: number,
    status_pipeline: number,
    access_users: IAccessUser[],
    last_running: string
}
interface IListFakeData extends Array<IFakeData>{}


let fakeData: IListFakeData = [
    {
        id: 1,
        title: "Update daily revenue daily kabupaten ",
        category: "NRA Weekly report",
        last_running: "03 Feb 2021 17:20",
        status_running: 0,
        status_pipeline: 1,
        access_users: [
            {
                id: 1,
                name: "Lorem",
                photo: "https://source.unsplash.com/random/68x68"
            },
            {
                id: 2,
                name: "Gorila",
                photo: 'https://source.unsplash.com/random/68x68'
            }
        ]
    },
    {
        id: 1,
        title: "Clean storage data tmp daily ",
        category: "NRA Weekly report",

        last_running: "03 Feb 2021 17:20",
        status_running: 1,
        status_pipeline: 2,
        access_users: [
            {
                id: 1,
                name: "Lorem",
                photo: "https://source.unsplash.com/random/68x68"
            },
            {
                id: 2,
                name: "Gorila",
                photo: 'https://source.unsplash.com/random/68x68'
            }
        ]
    },
    {
        id: 9,
        title: "Update market share facebook scrapper selenium weekly",
        category: "NRA Weekly report",

        last_running: "03 Feb 2021 17:20",
        status_running: 1,
        status_pipeline: 3,
        access_users: [
            {
                id: 1,
                name: "Lorem",
                photo: "https://source.unsplash.com/random/68x68?people,nature"
            },
            {
                id: 2,
                name: "Gorila",
                photo: 'https://source.unsplash.com/random/68x68?people'
            },
            {
                id: 2,
                name: "Gorila",
                photo: 'https://source.unsplash.com/random/68x68?person'
            }
        ]
    },
    {
        id: 2,
        title: "Incident excel transform realtime every 4s",
        category: "NRA Weekly report",

        last_running: "03 Feb 2021 17:20",
        status_running: 1,
        status_pipeline: 3,
        access_users: [
            {
                id: 1,
                name: "Lorem",
                photo: "https://source.unsplash.com/random/68x68"
            },
            {
                id: 2,
                name: "Gorila",
                photo: 'https://source.unsplash.com/random/68x68'
            }
        ]
    },
    {
        id: 2,
        title: "Check data anomaly revenue daily",
        category: "NRA Weekly report",

        last_running: "03 Feb 2021 17:20",
        status_running: 1,
        status_pipeline: 3,
        access_users: [
            {
                id: 1,
                name: "Lorem",
                photo: "https://source.unsplash.com/random/68x68"
            },
            {
                id: 2,
                name: "Gorila",
                photo: 'https://source.unsplash.com/random/68x68'
            }
        ]
    },
    {
        id: 2,
        title: "Convert master kabupaten converter realtime",
        category: "NRA Weekly report",

        last_running: "03 Feb 2021 17:20",
        status_running: 1,
        status_pipeline: 3,
        access_users: [
            {
                id: 1,
                name: "Lorem",
                photo: "https://source.unsplash.com/random/68x68"
            },
            {
                id: 2,
                name: "Gorila",
                photo: 'https://source.unsplash.com/random/68x68'
            }
        ]
    },
    {
        id: 2,
        title: "Subscriber daily kabupaten reload ",
        category: "NRA Weekly report",

        last_running: "03 Feb 2021 17:20",
        status_running: 1,
        status_pipeline: 3,
        access_users: [
            {
                id: 1,
                name: "Lorem",
                photo: "https://source.unsplash.com/random/68x68"
            },
            {
                id: 2,
                name: "Gorila",
                photo: 'https://source.unsplash.com/random/68x68'
            }
        ]
    },
    {
        id: 2,
        title: "Remove old database record daily",
        category: "NRA Weekly report",

        last_running: "03 Feb 2021 17:20",
        status_running: 1,
        status_pipeline: 3,
        access_users: [
            {
                id: 1,
                name: "Lorem",
                photo: "https://source.unsplash.com/random/68x68"
            },
            {
                id: 2,
                name: "Gorila",
                photo: 'https://source.unsplash.com/random/68x68'
            }
        ]
    },
    {
        id: 2,
        title: "Check growth storage Kafka Stream KAFS-071",
        category: "NRA Weekly report",

        last_running: "03 Feb 2021 17:20",
        status_running: 0,
        status_pipeline: 2,
        access_users: [
            {
                id: 1,
                name: "Lorem",
                photo: "https://source.unsplash.com/random/68x68"
            },
            {
                id: 2,
                name: "Gorila",
                photo: 'https://source.unsplash.com/random/68x68'
            }
        ]
    }
]
export default fakeData