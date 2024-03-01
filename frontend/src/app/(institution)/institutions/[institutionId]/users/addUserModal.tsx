import React, {useContext, useEffect, useRef, useState} from "react";
import i18n from "@/locales/i18n";
import Image from "next/image";
import {UserDto} from "types";
import UserInstitutionsContext
    from "@/app/(institution)/institutions/[institutionId]/users/contexts/InstitutionUsersContext";
import {constants} from "@/utils/constants";
import Modal from "@/app/components/Modal";
import InstitutionContext from "@/app/(institution)/institutions/[institutionId]/contexts/InstitutionContext";
import Cookie from "js-cookie";

function NotFound() {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center opacity-30">
            <Image
                src={"/icons/search.svg"}
                alt={"search icon"}
                width={50}
                height={50}
                className={"mb-4"}
            />

            <h3 className={"font-semibold"}>{i18n.t("No users found")}</h3>
            <p>{i18n.t("Try changing the search query")}</p>
        </div>
    );
}

function Loading() {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center opacity-30">
            <div
                className={
                    "w-[50px] h-[50px] mb-4" +
                    " border-2 border-l-transparent border-r-transparent" +
                    " border-t-black border-b-black" +
                    " rounded-full animate-spin"
                }
            />

            <h3 className={"font-semibold"}>{i18n.t("Loading")}</h3>
        </div>
    );
}

function UserDisplay({user, selected, setSelected, showSelected = false}: {
    user: UserDto;
    selected: UserDto | null;
    setSelected: React.Dispatch<React.SetStateAction<UserDto | null>>;
    showSelected?: boolean;
}) {
    if (selected && selected.id === user.id && !showSelected)
        return <></>;
    return (
        <div
            className={
                "flex justify-between items-center" +
                " p-4 border-b-2 border-light-blue" +
                (showSelected ? " border-b-4" : " ")
            }
        >
            <div className={"flex gap-4 items-center"}>
                <img
                    src={"/demo/demopfp.jpeg"}
                    alt={"profile"}
                    className="rounded-full aspect-square"
                    width={80}
                    height={80}
                />
                <div>
                    <h2>{user.firstName + " " + user.lastName}</h2>
                    <p>{user.email}</p>
                </div>
            </div>

            {(!selected || selected.id !== user.id) ? (
                <button
                    type={"button"}
                    className={"btn"}
                    title={i18n.t("Add user")}
                    onClick={() => setSelected(user)}
                >
                    <Image
                        src={"/icons/add.svg"}
                        alt={"add"}
                        width={30}
                        height={30}
                        className={"invert"}
                    />
                </button>
            ) : (
                <button
                    type={"button"}
                    className={"btn"}
                    title={i18n.t("Remove user")}
                    onClick={() => setSelected(null)}
                >
                    <Image
                        src={"/icons/remove.svg"}
                        alt={"remove"}
                        width={30}
                        height={30}
                        className={"invert"}
                    />
                </button>
            )}
        </div>
    );
}


export function AddUserModal({open, setOpen}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const {userInstitutions, setChanged} = useContext(UserInstitutionsContext);
    const {institution} = useContext(InstitutionContext);

    const [search, setSearch] = useState<string>("");
    const searchSignal = useRef<AbortController>(new AbortController());
    const [loading, setLoading] = useState<boolean>(false);

    const [results, setResults] = useState<UserDto[]>([]);
    const [selected, setSelected] = useState<UserDto | null>(null);

    useEffect(() => {
        searchSignal.current.abort("stopped");
        setLoading(true);
        fetch(
            `${constants.API}/api/auth/search?query=${search}`
        )
            .then(resp => {
                if (resp.status !== 200)
                    return;
                return resp.json()
            })
            .then((users: UserDto[]) => setResults(users.filter(
                user => !userInstitutions.some(
                    userInstitution =>
                        userInstitution.user.id === user.id
                ) && (
                    selected === null || (
                        selected.id !== user.id
                    )
                )
            )))
            .finally(() => setLoading(false));
    }, [search]);

    return (
        <Modal
            title={"Add user"}
            open={open}
            setOpen={setOpen}
        >
            <form
                className="flex flex-col gap-8"
                onSubmit={(e) => {
                    e.preventDefault();
                    if (selected !== null) {
                        setSearch("");
                        setSelected(null);
                        setOpen(false);
                    }

                    fetch(
                        `${constants.API}/api/institutions/users/${institution?.id}?userId=${selected?.id}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${Cookie.get("token")}`
                        }
                    })
                        .then(resp => {
                            if (resp.status !== 201)
                                return;
                            setSearch("");
                            setSelected(null);
                            setChanged(true);
                            setOpen(false);
                        });
                }}
            >
                <div>
                    <label htmlFor="firstName">{i18n.t("Search")}:</label>
                    <input
                        type="text"
                        className={"input"}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter")
                                e.preventDefault();
                        }}
                    />
                </div>

                <div
                    className={
                        "w-full h-96 bg-zinc-50 rounded-md border-2 border-light-blue" +
                        " shadow-md overflow-y-scroll scrollbar-hide" +
                        " flex flex-col"
                    }
                >
                    {loading && <Loading/>}
                    {!loading && selected !== null && (
                        <UserDisplay
                            user={selected}
                            selected={selected}
                            setSelected={setSelected}
                            showSelected
                        />
                    )}
                    {!loading && results.length === 0 && <NotFound/>}
                    {!loading && results.map((user, index) => (
                        <UserDisplay
                            key={index}
                            user={user}
                            selected={selected}
                            setSelected={setSelected}
                        />
                    ))}
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type={"submit"}
                        className="btn"
                        disabled={selected === null}
                    >
                        Add
                    </button>
                    <button
                        type={"button"} className={"danger-btn"}
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </Modal>
    );
}