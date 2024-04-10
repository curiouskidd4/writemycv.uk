import React, { useState } from "react";
import axios from "axios";
import { Avatar, Modal, Upload } from "antd";
import { UserOutlined, FileImageOutlined } from "@ant-design/icons";
import "./index.css";
import { useAuth } from "../../authContext";
import { storage } from "../../services/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const UpdatableProfilePic = () => {

  const [showModal, setShowModal] = useState(false);
  const { user, data, updateProfilePic } = useAuth();

  console.log("user", user, data);

  const updatePicInStorage = async (file: any) => {
    let userId = user.uid;
    console.log("user", user.uid);

    console.log(storage.app, `userData/${userId}/profilePic/${file.name}`);
    let fileRef = ref(storage, `userData/${userId}/profilePic/${file.name}`);
    await uploadBytes(fileRef, file);
    // Update the public url of the profile pic in user document
    let url = await getDownloadURL(fileRef);
    await updateProfilePic(url);

    console.log("URL", url);

    setShowModal(false);
  };

  return (
    <>
      <Modal
        title="Change Profile Picture"
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <Upload.Dragger
          // Only accept jpg, jpeg, png
          accept="image/jpeg,image/jpg,image/png"
          beforeUpload={(file) => {
            // setProfilePic(file as any);
            updatePicInStorage(file);
            return false;
          }}
        >
          <p className="ant-upload-drag-icon">
            <FileImageOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
        </Upload.Dragger>
      </Modal>
      <div className="profile-pic-container">
        {data?.photoURL ? (
          <img
            src={data?.photoURL}
            alt="profile"
            style={{ width: "128px", height: "128px", borderRadius: "50%" }}
          />
        ) : (
          <Avatar size={128} icon={<UserOutlined />} />
        )}

        <div className="profile-pic-overlay">
          <button
            className="profile-pic-overlay-button"
            onClick={() => {
              // setProfilePicUrl(null);
              setShowModal(true);
            }}
          >
            Change
          </button>
        </div>
      </div>
    </>
  );
};

export default UpdatableProfilePic;
