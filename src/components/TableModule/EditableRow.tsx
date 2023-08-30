import React, { useEffect } from 'react';
import { Form } from 'antd';

const { useForm } = Form;

interface EditableRowProps {
  record: any;
  editing: boolean;
  saving: boolean;
  // localChange: (record: any) => void;
  onSave: (record: any) => void;
}

const EditableRow: React.FC<EditableRowProps> = ({ record, editing, saving, onSave, ...props }) => {
  const [form] = useForm();

  useEffect(() => {
    if (editing) {
      form.setFieldsValue(record);
    }
  }, [editing])

  useEffect(() => {
    if (saving) {
      form.validateFields().then(res => {
        onSave({
          ...res,
          id: record.id
        });
      }).catch(e => {
        onSave(undefined);
      })
    }
  }, [saving])

  return (
    <Form form={form} component={false}>
      <tr {...props} />
    </Form>
  );
};

export default EditableRow;
