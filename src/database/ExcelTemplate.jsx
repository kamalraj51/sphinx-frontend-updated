import * as XLSX from "xlsx";

export const downloadTemplate = () => {
  const data = [
    [
      "questionDetail",
      "questionTypeId",
      "topicId",
      "optionA",
      "optionB",
      "optionC",
      "optionD",
      "answer",
      "numAnswers",
      "difficultyLevel",
      "answerValue",
      "negativeMarkValue",
    ],
    [
      "What is the chemical symbol for gold?",
      "SINGLE_CHOICE",
      "SPX_TM_10001",
      "Au",
      "Ag",
      "Gd",
      "Go",
      "A",
      "1",
      "2",
      "1",
      "2",
    ],
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(data);

  worksheet["!cols"] = [
    { wch: 10 },
    { wch: 30 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 10 },
    { wch: 12 },
    { wch: 20 },
    { wch: 15 },
    { wch: 15 },
    { wch: 20 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Questions");

  XLSX.writeFile(workbook, "excel_ques_template.xlsx");
};
