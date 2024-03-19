import Image from "next/image";
import getAuthenticated from "@/utils/getAuthenticated";
import i18n from "@/locales/i18n";

export default async function Profile() {
    const user = await getAuthenticated();

    return (
        <section className="py-16 px-4 sm:px-8 md:px-16 lg:px-32 flex flex-wrap gap-16">
            <Image
                src={"/demo/demopfp.jpeg"}
                alt={"pfp"}
                width={256}
                height={256}
                className={"aspect-square object-cover rounded-full shadow-md"}
            />

            <div>
                <h2 className={"text-2xl bold mb-4"}>{user?.username}</h2>
                <h3>{user?.firstName + " " + user?.lastName}</h3>
                <h3>{i18n.t("Email")}: {user?.email}</h3>
                <h3>{i18n.t("Phone number")}: {user?.phone}</h3>
                <h3>{i18n.t("Created at")}: {new Date(user?.createdAt!).toDateString()}</h3>
            </div>
        </section>
    );
}