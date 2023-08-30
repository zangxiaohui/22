import React, { useEffect, useMemo, useState } from 'react';
import { Upload, Modal, message } from 'antd';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { UploadFile, UploadProps, RcFile, UploadChangeParam } from 'antd/lib/upload/interface';
import styles from './index.module.scss';

interface AttachmentUploadProps extends Pick<UploadProps, | 'disabled' | 'accept'> {
  value?: string | string[];
  maxSize?: number;
  max?: number;
  aspect?: number;
  onChange?: (name: any) => void;
}

const AttachmentUpload: React.FC<AttachmentUploadProps> = (props) => {
  const { value, onChange, maxSize, max, aspect, accept, disabled } = props;
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string>('');

  const text = useMemo(() => {
    return !disabled ? (
      <span style={{marginRight: '5px'}}>
        <ExclamationCircleOutlined />
        支持{accept}格式，文件小于{maxSize}MB
      </span>
    ) : null;
  }, [disabled, accept, maxSize]);

  const fireChange = (newFileList: UploadFile[]) => {
    if (onChange) {
      const res:string[] = newFileList.map(i => i.uid);
      if (max === 1) {
        if (res.length) {
          onChange(res[0]);
        } else {
          onChange('');
        }
      } else {
        onChange(res);
      }
    }
  };

  const beforeUpload = (file: RcFile, fileList: RcFile[]): boolean => {
    const { name } = file;
    const suffix = name.split('.')[name.split('.').length - 1];
    const limitFileType = accept ? accept.includes(suffix.toLocaleLowerCase()) : true;
    if (file.size > maxSize! * 1024 * 1024) {
      message.warning(`上传大小不得超过${maxSize!}Mb`);
      return false;
    }
    if (!limitFileType) {
      message.error(`请上传正确的文件格式(${accept})`);
      return false;
    }
    return true;
  }

  const onRemove = (file: UploadFile) => {
    const res = fileList.filter(i => i.url !== file.url);
    fireChange(res);
  };

  const onPreview = (file: UploadFile) => {
    setPreviewImage(file.url!)
  };

  const onUploadChange = (info: UploadChangeParam<UploadFile>) => {
    let fileList = [...info.fileList];
    fileList = fileList
      .filter((file) => !!file.status);
    setFileList(fileList);
    if (info.file.status) {
      const newFileList = fileList.map(i => ({ ...i, status: 'done' }));
      setFileList(newFileList);
      onChange!(newFileList);
    }
  };

  return (
    <>
      <div>
        <Upload
          listType="picture-card"
          accept={accept}
          fileList={fileList}
          onRemove={onRemove}
          onPreview={onPreview}
          beforeUpload={beforeUpload}
          customRequest={() => console.log('fake upload')}
          onChange={onUploadChange}
        >
          {fileList.length < max! && <PlusOutlined />}
        </Upload>
        {text}
      </div>
      <Modal
        className={styles.imgWrapper}
        visible={!!previewImage}
        title="图片预览"
        footer={null}
        onCancel={() => {setPreviewImage('')}}
      >
        <img className={styles.img} alt="图片" src={previewImage} />
      </Modal>
    </>
  )
};

AttachmentUpload.defaultProps = {
  max: 1,
  maxSize: 1,
  aspect: 1,
  disabled: false,
  accept: '.jpg,.jpeg,.png,.gif'
}

export default AttachmentUpload;
