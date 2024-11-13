import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as bases from "../components/bases";
import * as components from "../components/components";
import * as constants from "../components/constants";
import * as utils from "../components/utils";

export default function ReportPage() {
    const dispatch = useDispatch();
    const params = useParams();
    const task = useSelector((state: any) => state.taskList);
    const userId = utils.LocalStorage.get("user_id"); 
    const [reportData, setReportData] = useState<any>(null);

    async function getReport() {
        components.constructorWebAction(
        dispatch,
        constants.taskList,
        `${constants.host}/api/report/check/${params.id}`,
        "GET"
        );
    }

    useEffect(() => {
        getReport();
    }, []);

    useEffect(() => {
        if (task.data) {
        setReportData(task.data);
        }
    }, [task.data]);

    return (
        <bases.Base1>
        <div className="flex items-center flex-col gap-y-10 mt-20 w-full">
            <h3 className="text-4xl font-bold leading-9 tracking-tight text-slate-50 mb-10">
            Отчет по задаче
            </h3>

            {reportData ? (
            <div className="flex flex-col items-start gap-y-6 w-2/3 bg-white p-6 rounded shadow-lg">
                <div>
                <h4 className="text-2xl font-semibold text-slate-800 mb-2">Текст задания:</h4>
                <p className="text-slate-600">{reportData.task_text}</p>
                </div>
                <br />
                <h4 className="text-2xl font-semibold text-slate-800 mb-2">Комментарий исполнителя:</h4>
                {reportData.task_report && reportData.task_report.lenth && (
                <div>
                    <p className="text-slate-600">{reportData.task_report.comment}</p>
                </div>
                )}
                <br />
                <h4 className="text-2xl font-semibold text-slate-800 mb-2">Файл с решением задачи :</h4>
                {reportData.task_report && reportData.task_report.file && (
                <div>
                    <a
                    href={`${constants.host}${reportData.task_report.file}`}
                    download
                    className="text-blue-500 underline"
                    >
                    Скачать файл
                    </a>
                </div>
                
                )}
                <br />
                <h4 className="text-2xl font-semibold text-slate-800 mb-2">Комментарий проверяющего:</h4>
                {reportData.task_check && reportData.task_check.length > 0 ? (
                    <div>
                        <p className="text-slate-600">{reportData.task_check[0].comment}</p>
                    </div>):""
                    }
            </div>
            ) : (
            ""
            )}
        </div>
        </bases.Base1>
    );
    }