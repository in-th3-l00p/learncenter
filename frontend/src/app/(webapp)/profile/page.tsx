import Image from "next/image";
import getAuthenticated from "@/utils/getAuthenticated";
import i18n from "@/locales/i18n";
import ErrorMessage from "@/app/components/errorMessage";

export default async function Profile() {
    const user = await getAuthenticated();

    return (
        <section className="py-16 px-4 sm:px-8 md:px-16 lg:px-32">
            <div className="pb-8 border-b-2 border-b-light-blue mb-8 flex flex-wrap gap-16">
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
            </div>

            <div className={"pb-8 mb-8 border-b-2 border-b-light-blue"}>
                <h2 className={"text-2xl mb-8"}>{ i18n.t("Edit profile information") }</h2>

                <form
                    className={"max-w-3xl w-full"}
                >
                    <div className="w-full grid sm:grid-cols-2 gap-8 mb-8">
                        <div>
                            <label htmlFor="firstName">{i18n.t("First name:")}</label>
                            <input
                                type="text" className={"input"}
                                name={"firstName"} id={"firstName"}
                                required
                                defaultValue={user?.firstName}
                            />
                            {/*<ErrorMessage error={i18n.t(errors["firstName"])} />*/}
                        </div>

                        <div>
                            <label htmlFor="lastName">{i18n.t("Last name:")}</label>
                            <input
                                type="text" className={"input"}
                                name={"lastName"} id={"lastName"}
                                required
                                defaultValue={user?.lastName}
                            />
                            {/*<ErrorMessage error={i18n.t(errors["lastName"])} />*/}
                        </div>
                    </div>

                    <div className={"mb-8"}>
                        <label htmlFor="phone">{i18n.t("Phone number:")}</label>
                        <input
                            type="tel" name="phone"
                            id="phone" className={"input"}
                            required
                            defaultValue={user?.phone}
                        />
                        {/*<ErrorMessage error={i18n.t(errors["phone"])} />*/}
                    </div>

                    <div className={"mb-4 pb-8 border-b"}>
                        <label htmlFor="username">{i18n.t("Username:")}</label>
                        <input
                            type="text" name="username"
                            id="username" className={"input"}
                            required
                            defaultValue={user?.username}
                        />
                        {/*<ErrorMessage error={i18n.t(errors["username"])} />*/}
                    </div>

                    <div className={"mb-8"}>
                        <label htmlFor="email">{i18n.t("Email address:")}</label>
                        <input
                            type="email" name="email"
                            id="email" className={"input"}
                            required
                            defaultValue={user?.email}
                        />
                        {/*<ErrorMessage error={i18n.t(errors["email"])} />*/}
                    </div>

                    <button
                        type="submit" className="btn"
                    >
                        {i18n.t("Edit")}
                    </button>
                </form>
            </div>

            <div>
                <h2 className={"text-2xl mb-8"}>{ i18n.t("Change password") }</h2>

                <form
                    className={"max-w-3xl w-full"}
                >
                    <div className={"mb-8"}>
                        <label htmlFor="currentPassword">{i18n.t("Current password:")}</label>
                        <input
                            type="password" name="currentPassword"
                            id="currentPassword" className={"input"}
                            required
                        />
                        {/*<ErrorMessage error={i18n.t(errors["password"])} />*/}
                    </div>

                    <div className={"mb-8"}>
                        <label htmlFor="password">{i18n.t("Password:")}</label>
                        <input
                            type="password" name="password"
                            id="password" className={"input"}
                            required
                        />
                        {/*<ErrorMessage error={i18n.t(errors["password"])} />*/}
                    </div>

                    <div className={"mb-8"}>
                        <label htmlFor="passwordConfirmed">{i18n.t("Confirm password:")}</label>
                        <input
                            type="password" name="passwordConfirmed"
                            id="passwordConfirmed" className={"input"}
                            required
                        />
                        {/*<ErrorMessage error={i18n.t(errors["passwordConfirmed"])} />*/}
                    </div>

                    <button type="submit" className="btn">{i18n.t("Confirm")}</button>
                </form>
            </div>
        </section>
    );
}