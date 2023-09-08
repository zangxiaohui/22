import type { ColumnsType } from "antd/es/table";
import { serverPath } from "../../Login/LoginForm";

export const columns: ColumnsType<any> = [
  {
    title: "资质名称",
    key: "CusFile_Title",
    dataIndex: "CusFile_Title",
  },
  {
    title: "查看证书",
    dataIndex: "CusFile_LocalPath",
    key: "CusFile_LocalPath",
    render: (text, record) => {
      return (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => window.open(`${serverPath}${text}`)}
        >
          {record?.CusFile_FileType}
          {/* <PictureOutlined style={{ fontSize: 30, color: "#2a598f" }} /> */}
        </div>
      );
    },
  },
];
