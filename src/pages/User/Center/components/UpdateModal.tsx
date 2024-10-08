import { ProColumns, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Modal } from 'antd';
import {useEffect, useRef} from "react";
import {ProFormInstance} from "@ant-design/pro-form/lib";

export type Props = {
  values: API.InterfaceInfo;
  columns: ProColumns<API.UserVO>[];
  onCancel: () => void; // 点击取消时候触发
  onSubmit: (values: API.UserVO) => Promise<void>; // 提交时触发
  open: boolean;
};
const UpdateModal: React.FC<Props> = (props) => {
  const { values, open, columns, onCancel, onSubmit } = props;

  const formRef = useRef<ProFormInstance>();
  useEffect(() => {
    if (formRef) {
      formRef.current?.setFieldsValue(values);
    }
  }, [values])

  return (
    <Modal
      open={open}
      onCancel={() => {
        onCancel?.();
      }}
      footer={null}
    >
      <ProTable
        type={'form'}
        columns={columns}
        form={{
          initialValues: values,
        }}
        onSubmit={async (value) => {
          onSubmit?.(value);
        }}
      />
    </Modal>
  );
};
export default UpdateModal;
