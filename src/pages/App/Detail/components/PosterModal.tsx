import { Modal, Button } from 'antd';

const ShareModal = ({ visible, onCancel, onDownload, imageUrl }) => {
  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          取消
        </Button>,
        <Button key="download" type="primary" onClick={onDownload}>
          下载图片
        </Button>,
      ]}
    >
      <img src={imageUrl} alt="分享图片" style={{ width: '100%' }} />
    </Modal>
  );
};
export default ShareModal;
