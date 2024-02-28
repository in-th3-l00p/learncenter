import Image from "next/image";
import getAuthenticated from "@/utils/getAuthenticated";

export default async function Dashboard() {
    const user = await getAuthenticated();

    return (
        <section className="py-16 px-4 sm:px-8 md:px-16 lg:px-32">
            <div className={"flex gap-8 items-center pb-8 border-b-2 border-b-light-blue mb-8"}>
                <Image
                    src="/demo/demopfp.jpeg" alt="demo"
                    width={150} height={150}
                    className={"aspect-square object-cover rounded-full shadow-md"}
                />
                <div>
                    <h1 className={"text-4xl font-semibold"}>Hello, {user?.firstName + " " + user?.lastName}!</h1>
                    <p className={"text-lg"}>Welcome to LearnCenter!</p>
                </div>
            </div>
        </section>
    )
}
