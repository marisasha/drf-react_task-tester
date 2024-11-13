import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import * as bases from "../components/bases";
import * as components from "../components/components";
import * as constants from "../components/constants";
import * as utils from "../components/utils";

export default function ReportPage() {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const task = useSelector((state: any) => state.taskList);
  const userId = utils.LocalStorage.get("user_id");
  const [reportData, setReportData] = useState<any>(null);
  const [form, setForm] = useState({
    user_id: userId,
    comments: "",
    file: null,
  });
  const [loading, setLoading] = useState(false);


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

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    setForm((prevForm) => ({
      ...prevForm,
      file: file,
    }));
  };

  const sendForm = (event: any) => {
    event.preventDefault();

    if (!task.load) {
      const formData = new FormData();
      formData.append("user_id", form.user_id);
      formData.append("comment", form.comments);
      if (form.file) {
        formData.append("file", form.file);
      }

      setLoading(true);
      components.constructorWebAction(
        dispatch,
        constants.taskResponse,
        `${constants.host}/api/report/check/${params.id}`,
        "POST",
        formData,
        10000,
        true
      )
        .then(() => {
          navigate("/my_tasks"); 
        })
        .catch((error) => {
          console.error("Ошибка при отправке формы:", error);
          setLoading(false);
        });
    }
  };

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

            {reportData.task_report && reportData.task_report.comment && (
              <div>
                <h4 className="text-2xl font-semibold text-slate-800 mb-2">Комментарий исполнителя:</h4>
                <p className="text-slate-600">{reportData.task_report.comment}</p>
              </div>
            )}

            {reportData.task_report && reportData.task_report.file && (
              <div>
                <h4 className="text-2xl font-semibold text-slate-800 mb-2">Файл с решением задачи :</h4>
                <a
                  href={`${constants.host}/static${reportData.task_report.file}`}
                  download
                  className="text-blue-500 underline"
                >
                  Скачать файл
                </a>
              </div>
            )}

            <form onSubmit={sendForm} className="w-full mt-4">
              <div>
                <h4 className="text-2xl font-semibold text-slate-800 mb-2">Комментарий проверяющего:</h4>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded resize-none h-20"
                  name="comments"
                  placeholder="Введите ваш комментарий"
                  value={form.comments}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !form.comments}
                className={`mt-4 px-4 py-2 bg-blue-600 text-white rounded ${
                  loading || !form.comments ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Отправка..." : "Подтвердить отчет"}
              </button>
            </form>
          </div>
        ) : (
          ""
        )}
      </div>
    </bases.Base1>
  );
}