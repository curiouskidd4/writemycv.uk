import React, { useEffect } from "react";
import { Button, Row, Space, Typography, Col, Menu, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const ConfirmItemDelete = ({ onDelete, text }: { onDelete?: () => void, text: string }) => {
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  return (
    <>
      <Row
        justify="end"
        style={{ width: "70%", paddingRight: "2rem", paddingBottom: "2rem"  , paddingTop: "2rem" }}
        className="delete-btn-row"
      >
        <Button
          type="link"
          size="small"
          onClick={() => {
            setShowDeleteModal(true);
          }}
          className="small-link-btn danger"
        >
          <i className="fa-solid fa-trash"></i>
          {text}
        </Button>
      </Row>

      <Modal
        className="delete-modal"
        title="Are you sure you want to delete?"
        open={showDeleteModal}
        onOk={() => onDelete && onDelete()}
        onCancel={() => {
          setShowDeleteModal(false);
        }}
      >
        <p>This action cannot be undone.</p>
      </Modal>
    </>
  );
};

export default ConfirmItemDelete;
