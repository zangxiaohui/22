import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Button, message, Upload } from "antd";
import React from "react";

const App: React.FC = () => {
  const openid = localStorage.getItem("baichuan_openid");
  const curtoken = localStorage.getItem("baichuan_curtoken");

  const props: UploadProps = {
    name: "filezjz",
    // action: "http://baichuanpm.test.wxliebao.com/CusApi/ComData/regbusinessfile",
    action: "/CusApi/ComData/regbusinessfile",
    headers: {
      openid: openid!,
      curtoken: curtoken!,
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <Upload {...props}>
      <Button icon={<UploadOutlined />}>Click to Upload</Button>
    </Upload>
  );
};

export default App;
