

interface UserObject {
    id: number,
    photo: string,
    name: string
}
interface PropsInterface {
    users: Array<UserObject>
}

export default function AvatarUserAccess(props: PropsInterface): JSX.Element {

    const users = props.users.map((el,key) => {
        return <img key={key} src={el.photo} width="48" height="48" alt={el.photo} className="w-10 h-10 object-cover rounded-full bg-gray-100 border-2 border-white cursor-pointer" loading="lazy"  title={el.name}/>
    })

    return <dd className="flex justify-end sm:justify-start lg:justify-end xl:justify-start -space-x-4">{users}</dd>

}
