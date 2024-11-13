import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import * as bases from "../components/bases";
import * as utils from "../components/utils";
import * as constants from "../components/constants";
import * as components from "../components/components";
import * as loaders from "../components/loaders";

export default function Page() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const taskResponse = useSelector((state: any) => state.taskResponse);
    const params = useParams();
    const userId = utils.LocalStorage.get("user_id");

    const [form, setForm] = useState({
        user_id: userId,
        comments: "",
        file: null,
    });

    function sendForm(event: any) {
        event.preventDefault();

        if (!taskResponse?.load) {
            const formData = new FormData();
            formData.append("user_id", form.user_id);
            formData.append("comment", form.comments);
            if (form.file) {
                formData.append("file", form.file);
            }

            components.constructorWebAction(
                dispatch,
                constants.taskResponse,
                `${constants.host}/api/report/${params.id}`,
                "POST",
                formData,
                10000,
                true
            ).then(() => {
                navigate("/my_tasks"); 
            });
        }
    }


    return (
        <bases.Base1>
            <div className="flex flex-col gap-y-10 mx-20 mt-20 pt-10 rounded-lg items-center ml-96 box-border w-full">
                <h3 className="text-4xl font-bold leading-9 tracking-tight text-slate-50">Отчёт</h3>

                <form className="w-full" onSubmit={sendForm}>
                    <div>
                        <label className="block text-sm font-semibold leading-6 text-slate-50">Комментарий:</label>
                        <textarea
                            onChange={(event) => setForm({ ...form, comments: event.target.value })}
                            value={form.comments}
                            required
                            placeholder="Введите комментарий..."
                            className="block w-full h-40 rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-gray-300 text-slate-500 focus:ring-2 resize-none focus:ring-inset focus:ring-indigo-600 sm:text-sm p-2"
                        />
                    </div>
                    <div className="my-4">
                        <label className="block text-sm font-semibold leading-6 text-slate-50">Прикрепите файл:</label>
                        <label className="file-upload-label">
                            <i className="fa fa-upload"></i>
                            {/* @ts-ignore */}
                            {form.file ? form.file.name : "Выберите файл"}
                            <input type="file" className="file-input" onChange={(event: any) => setForm({ ...form, file: event.target.files[0] })} />
                        </label>
                    </div>

                    <div className="mt-3 m-auto flex justify-center">
                        <button
                            type="submit"
                            className="flex w-60 justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-500 focus:outline-none"
                        >
                            Отправить ответ
                        </button>
                    </div>
                </form>
            </div>
        </bases.Base1>
    );
}