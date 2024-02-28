import {useEffect, useRef, useState} from "react";
import {UserDto} from "types";
import Modal from "@/app/components/Modal";
import i18n from "@/locales/i18n";
import Image from "next/image";
import {constants} from "@/utils/constants";

export function AddButton() {
    const [open, setOpen] = useState<boolean>(false);

    const [search, setSearch] = useState<string>("");
    const searchSignal = useRef<AbortController>(new AbortController());
    const [results, setResults] = useState<UserDto[]>([]);

    useEffect(() => {
        searchSignal.current.abort("stopped");
        fetch(
            `${constants.API}/api/auth/search?query=${search}`,
            // { signal: searchSignal.current.signal }
        )
            .then(resp => {
                console.log(resp);
                if (resp.status !== 200)
                    return;
                return resp.json()
            })
            .then(setResults);
    }, [search]);

    return (
        <>
            <Modal title={"Add user"} open={open} setOpen={setOpen}>
                <form className="flex flex-col gap-8">
                    <div>
                        <label htmlFor="firstName">{i18n.t("Search")}:</label>
                        <input
                            type="text"
                            className={"input"}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div
                        className={"w-full h-96 bg-zinc-50 rounded-md border-2 border-light-blue shadow-md overflow-y-scroll"}>
                        {results.length === 0 && (
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
                        )}
                    </div>

                    <div className="flex justify-end gap-4">
                        <button type={"submit"} className="btn">Add</button>
                        <button
                            type={"button"} className={"danger-btn"}
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
            <button
                className={"btn"}
                title={i18n.t("Add user")}
                onClick={() => setOpen(true)}
            >
                <Image
                    src="/icons/add.svg"
                    alt="add"
                    className={"invert"}
                    width={30} height={30}
                />
            </button>
        </>
    );
}