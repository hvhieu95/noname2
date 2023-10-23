export type DocumentType = {
  id: string;
  name: string;
  uri: string;
  fileType:string;
};

const documents: DocumentType[] = [
  {
    id: "1",
    name: "file pdf",
    uri: "https://transfer.sh/T19vvFtBMj/c4611_sample_explain.pdf",
    fileType:"pdf",
  },
  {
    id: "2",
    name: " file excel",
    uri: "https://transfer.sh/c1onBs00w2/%E5%8F%82%E6%95%B0%E8%A1%A8.xlsx",
    fileType:"xlsx",
  },
  {
    id: "3",
    name: " file words",
    uri: "https://transfer.sh/rvq45hMe0N/sample1.docx",
    fileType:"docx",
  },
  {
    id: "4",
    name: " file powerpoints",
    uri: "https://transfer.sh/9hXYSLu39h/file_example_PPT_1MB.ppt",
    fileType:"ppt",
  },
];
export default documents;
