import getAuthenticated from "@/utils/getAuthenticated";

export default async function Dashboard() {
    const user = await getAuthenticated();

    return (
        <div>
            <p>{ JSON.stringify(user) }</p>
        </div>
    );
}