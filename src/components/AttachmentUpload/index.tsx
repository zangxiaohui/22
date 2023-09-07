import { ExclamationCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Modal, Upload, message } from "antd";
import {
  RcFile,
  UploadChangeParam,
  UploadFile,
  UploadProps,
} from "antd/lib/upload/interface";
import classNames from "classnames";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./index.module.scss";

interface AttachmentUploadProps
  extends Pick<UploadProps, "disabled" | "accept"> {
  value?: string | string[];
  maxSize?: number;
  max?: number;
  aspect?: number;
  onChange?: (name: any) => void;
  className?: string;
  btnType?: string;
}

const AttachmentUpload: React.FC<AttachmentUploadProps> = (props) => {
  const {
    value,
    onChange,
    maxSize,
    max,
    aspect,
    accept,
    disabled,
    className,
    btnType = "default",
  } = props;
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string>("");

  useEffect(() => {
    if (fileList.length) return;
    let newValue: string[];
    if (!value) {
      newValue = [];
    } else if (typeof value === "string") {
      newValue = [value];
    } else {
      newValue = value;
    }
    setFileList(
      newValue!.map((item) => {
        return {
          status: "done" as any,
          size: 0,
          type: "",
          url: item,
        };
      })
    );
  }, [fileList.length, value]);

  const text = useMemo(() => {
    return !disabled ? (
      <span className="upload-tips">
        <ExclamationCircleOutlined style={{ marginRight: "5px" }} />
        支持{accept}格式，文件小于{maxSize}MB
      </span>
    ) : null;
  }, [disabled, accept, maxSize]);

  const fireChange = (newFileList: UploadFile[]) => {
    if (onChange) {
      const res: string[] = newFileList.map((i) => i.uid);
      if (max === 1) {
        if (res.length) {
          onChange(res[0]);
        } else {
          onChange("");
        }
      } else {
        onChange(res);
      }
    }
  };

  const beforeUpload = (file: RcFile, fileList: RcFile[]): boolean => {
    const { name } = file;
    const suffix = name.split(".")[name.split(".").length - 1];
    const limitFileType = accept
      ? accept.includes(suffix.toLocaleLowerCase())
      : true;
    if (file.size > maxSize! * 1024 * 1024) {
      message.warning(`上传大小不得超过${maxSize!}Mb`);
      return false;
    }
    if (!limitFileType) {
      message.error(`请上传正确的文件格式(${accept})`);
      return false;
    }
    return true;
  };

  const onRemove = (file: UploadFile) => {
    const res = fileList.filter((i) => i.url !== file.url);
    fireChange(res);
  };

  const onPreview = (file: UploadFile) => {
    setPreviewImage(file.url!);
  };

  const onUploadChange = (info: UploadChangeParam<UploadFile>) => {
    let fileList = [...info.fileList];
    fileList = fileList
      .filter((file) => !!file.status)
      .map((file) => {
        if (file.response) {
          file.url = file.response.data;
        }
        return file;
      });

    if (info.file.status !== "uploading") {
      const doneFiles = fileList.filter((file) => !!file.url);
      onChange!(doneFiles);
    }
    setFileList(fileList);
  };

  const openid = localStorage.getItem("baichuan_openid");
  const curtoken = localStorage.getItem("baichuan_curtoken");

  const uploadProps: UploadProps = {
    name: "filezjz",
    action: `/CusApi/ComData/regbusinessfile`,
    headers: {
      openid: openid!,
      curtoken: curtoken!,
    },
  };

  return (
    <>
      <div className="upload-wrap">
        <Upload
          {...uploadProps}
          listType="picture"
          accept={accept}
          fileList={fileList}
          onRemove={onRemove}
          onPreview={onPreview}
          beforeUpload={beforeUpload}
          onChange={onUploadChange}
        >
          {fileList.length < max! && (
            <Button
              type={btnType as any}
              icon={<UploadOutlined />}
              className={classNames("upload-btn", className)}
            >
              点击上传
            </Button>
          )}
        </Upload>
        {text}
      </div>
      <Modal
        className={styles.imgWrapper}
        open={!!previewImage}
        title="图片预览"
        footer={null}
        onCancel={() => {
          setPreviewImage("");
        }}
      >
        <img className={styles.img} alt="图片" src={previewImage} />
      </Modal>
    </>
  );
};

AttachmentUpload.defaultProps = {
  max: 1,
  maxSize: 1,
  aspect: 1,
  disabled: false,
  accept: ".jpg,.jpeg,.png,.gif",
};

export default AttachmentUpload;
