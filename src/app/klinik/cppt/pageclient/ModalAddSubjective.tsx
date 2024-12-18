"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import AlertHeaderComponent from "../../setting/paramedis/components/AlertHeaderComponent";
import { Session } from "next-auth";
import { ToastAlert } from "@/app/helper/ToastAlert";
import { ToastAlert2 } from "@/app/components/Toast2";

const ModalAddSubjective = ({
  session,
  onSave,
}: {
  session: Session | null;
  onSave: (data: any[]) => void;
}) => {
  const [activeOption, setActiveOption] = useState<string>("shortcut");
  const [listSubjective, setListSubjective] = useState<any>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [allAnswers, setAllAnswers] = useState<any[]>([]);
  const [freeText, setFreeText] = useState<string>("");

  const [submittedFreeText, setSubmittedFreeText] = useState<string | null>(
    null
  );
  const [submittedTableData, setSubmittedTableData] = useState<any[]>([]);

  const handleSave = () => {
    const modal: any = document.getElementById("add-subjective");
    if (activeOption === "text") {
      if (!freeText.trim()) {
        modal.close();
        ToastAlert2({ icon: "error", title: "Ooops", text: "Wajib diisi" });
        setSubmittedTableData([]);
        return;
      }
      setSubmittedFreeText(freeText);
      setSubmittedTableData([]);
      onSave([
        {
          question: null,
          answer: freeText,
        },
      ]);
      ToastAlert({
        icon: "success",
        title: "Berhasil menambahkan Subjective",
      });
      modal.close();
    } else if (activeOption === "shortcut") {
      const hasEmptyAnswer = tableData.some((item) => !item.answer);
      if (hasEmptyAnswer || tableData.length === 0) {
        modal.close();
        ToastAlert2({
          icon: "error",
          title: "Ooops",
          text: "Semua pertanyaan harus diisi",
        });
        setSubmittedFreeText(null);
        return;
      }
      const formattedData = tableData.map((item) => ({
        question: item.question.label,
        answer: item.answer,
      }));
      setSubmittedFreeText(null);
      setSubmittedTableData(tableData);
      onSave(formattedData);
      ToastAlert({
        icon: "success",
        title: "Berhasil menambahkan Subjective",
      });
      modal.close();
    }
  };

  useEffect(() => {
    async function getListSubjective() {
      const getRes = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/master-subjective/${session?.user.idFasyankes}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          },
        }
      );
      if (!getRes.ok) {
        setListSubjective([]);
        return;
      }
      const data = await getRes.json();
      const newArr = data.map((item: any) => ({
        label: item.question,
        value: item.id,
        questionType: item.questionType,
      }));
      setListSubjective(newArr);
    }
    getListSubjective();
  }, [session?.user.idFasyankes]);

  useEffect(() => {
    async function getAnswer() {
      const getRes = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BE_KLINIK}/subjective-answer`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          },
        }
      );
      if (!getRes.ok) {
        setAllAnswers([]);
        return;
      }
      const data = await getRes.json();
      setAllAnswers(data);
    }
    getAnswer();
  }, [session?.user.idFasyankes]);

  const handleToggle = (option: string) => {
    setActiveOption(option);
    // Restore values when toggling
    if (option === "text") {
      setFreeText(submittedFreeText || "");
    } else if (option === "shortcut") {
      setTableData(submittedTableData);
    }
  };

  const handleAddToTable = (selectedQuestion: any) => {
    if (selectedQuestion) {
      setTableData((prev) => [
        ...prev,
        {
          id: tableData.length + 1,
          question: { ...selectedQuestion, type: selectedQuestion.type },
        },
      ]);
    }
  };

  const filterAnswersByQuestionId = (questionId: number) => {
    return allAnswers
      .filter((answer) => answer.questionId === questionId)
      .map((answer) => ({
        label: answer.answer,
        value: answer.id,
      }));
  };

  const handleInputChange = (id: number, value: string | number | null) => {
    setTableData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, answer: value } : item))
    );
  };

  const handleValueFreeText = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFreeText(event.target.value);
  };

  return (
    <dialog id="add-subjective" className="modal">
      <div className="modal-box w-8/12 max-w-xl h-5/6 relative ">
        <AlertHeaderComponent message="Subjective" />
        <div className="flex flex-col">
          <div className="flex bg-gray-200 rounded-md w-full py-3 px-3 gap-2 mt-3">
            <button
              type="button"
              onClick={() => handleToggle("shortcut")}
              className={`py-2 w-full transition-all duration-500 rounded-md 
                ${activeOption === "shortcut" ? "bg-white shadow" : ""}`}
            >
              Shortcut SOAP
            </button>
            <button
              type="button"
              onClick={() => handleToggle("text")}
              className={`py-2 px-3 w-full transition-all duration-500 rounded-md 
                ${activeOption === "text" ? "bg-white shadow" : ""}`}
            >
              Kolom SOAP
            </button>
          </div>

          {activeOption === "shortcut" && (
            <>
              <div className="label">
                <span className="label-text">Tambah Pertanyaan</span>
              </div>
              <div className="flex gap-2 items-center">
                <Select
                  className="w-full"
                  isClearable
                  placeholder="Pilih Pertanyaan"
                  options={listSubjective}
                  onChange={(option) => handleAddToTable(option)}
                />
              </div>

              <div className="overflow-x-auto mt-3 h-72">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Pertanyaan</th>
                      <th>Jawaban</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.question.label}</td>
                        <td>
                          {item.question.questionType === "text" ? (
                            <Select
                              className="w-full"
                              isClearable
                              placeholder="Pilih Jawaban"
                              options={filterAnswersByQuestionId(
                                item.question.value
                              )}
                              onChange={(option) =>
                                handleInputChange(
                                  item.id,
                                  option ? option.label : null
                                )
                              }
                            />
                          ) : item.question.questionType === "number" ? (
                            <input
                              type="text"
                              className="input input-bordered w-full"
                              placeholder="Jawaban"
                              value={item.answer || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  item.id,
                                  e.target.value || null
                                )
                              }
                            />
                          ) : item.question.questionType === "date" ? (
                            <input
                              type="date"
                              className="input input-bordered w-full"
                              value={item.answer || ""}
                              onChange={(e) =>
                                handleInputChange(item.id, e.target.value)
                              }
                            />
                          ) : null}
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-circle btn-outline btn-error btn-xs"
                            onClick={() =>
                              setTableData((prev) =>
                                prev.filter((_, idx) => idx !== index)
                              )
                            }
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="size-4"
                            >
                              <path
                                d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6"
                                stroke="#e82121"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></path>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeOption === "text" && (
            <>
              <div className="label">
                <span className="label-text">Tambah Subjective</span>
              </div>
              <div className="h-80">
                <textarea
                  className="textarea textarea-bordered h-full w-full"
                  placeholder="Tambah Subjective"
                  onChange={handleValueFreeText}
                ></textarea>
              </div>
            </>
          )}
        </div>

        <div className="absolute bottom-16 w-10/12 md:w-11/12">
          <button
            className="btn btn-sm btn-primary w-full text-white"
            onClick={handleSave}
          >
            Submit
          </button>
        </div>
        <form method="dialog" className="absolute bottom-5 w-10/12 md:w-11/12">
          <button className="btn btn-sm btn-error w-full text-white">
            Tutup
          </button>
        </form>
      </div>
    </dialog>
  );
};

export default ModalAddSubjective;
