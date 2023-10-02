import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import "./Admin.css";
import { useQuery } from "react-query";
import { AuthService } from "../../services/dataService";
import {
  Badge,
  Button,
  Card,
  Drawer,
  Input,
  List,
  Row,
  Tag,
  Typography,
  message,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import CreateInvite from "../invite/createInvite";
import moment from "moment";

const UserItem = ({ user }) => {
  return (
    <Card style={{ height: "200px" }}>
      {/* <div className="item user"> */}
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "baseline" }}>
        <>
          <UserOutlined />{" "}
          <Typography.Title level={5}>{user.name}</Typography.Title>
        </>
        {!user.disabled ? (
          <Badge
            color="green"
            text="Active"
            style={{ marginLeft: "auto" }}
          ></Badge>
        ) : (
          <Badge
            color="red"
            text="Inactive"
            style={{ marginLeft: "auto" }}
          ></Badge>
        )}
      </div>
      <div style={{ marginBottom: "6px" }}>
        {user.is_superuser && <Tag color="green">Super User</Tag>}
        {user.is_admin && <Tag color="cyan">Admin</Tag>}
        {!user.is_superuser && !user.is_admin && <Tag>Normal User</Tag>}
      </div>
      <Typography.Text>
        <span
          style={{
            color: "gray",
          }}
        >
          Email:
        </span>{" "}
        <span>{user.email}</span>
      </Typography.Text>
      <div>
        <span
          style={{
            color: "gray",
          }}
        >
          Created On:
        </span>{" "}
        {moment(user.created_at).format("YYYY/MM/DD hh:mm")}
      </div>
      <Row
        style={{
          marginTop: "10px",
        }}
      >
        {!user.disabled ? (
          <Button
            onClick={() => {
              message.info("Coming Soon");
            }}
          >
            Disable
          </Button>
        ) : (
          <Button
            onClick={() => {
              message.info("Coming Soon");
            }}
          >
            Enable
          </Button>
        )}
      </Row>
    </Card>
  );
};

export default function Users() {
  const [state, setState] = useState({
    newUserFlag: false,
    query: "",
    page: 1,
    pageSize: 10,
  });

  const users = useQuery(["super_users", state.query, state.page, state.pageSize], () =>
    AuthService.getAllUsers({
      query: state.query,
      page: state.page,
      page_size: state.pageSize,
    })
  );

  return (
    <Row>
      <Drawer
        width={500}
        title="New User"
        placement="right"
        closable={true}
        onClose={() => setState({ ...state, newUserFlag: false })}
        visible={state.newUserFlag}
      >
        <CreateInvite
          onSuccess={() => {
            message.success("User invite sent successfully");
          }}
          onError={() => {
            message.error("Something went wrong");
          }}
          onClose={() => setState({ ...state, newUserFlag: false })}
        />
      </Drawer>
      <div className="user-search-bar">
        <Input.Search placeholder="Search"
        onSearch={
          (query) => {
            setState({...state, query})
          }
        } />

        <Button
          type="primary"
          onClick={() => {
            setState({ ...state, newUserFlag: true });
          }}
        >
          New User
        </Button>
      </div>
      <List
        style={{
          width: "100%",
        }}
        grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
        className="users-list"
        loading={users.isLoading}
        pagination={{
          current: state.page,
          pageSize: state.pageSize,
          total: users.data?.total,
          onChange: (page, pageSize) => {
            setState({ ...state, page, pageSize });
          },
        }}
        dataSource={users.data?.results}
        renderItem={(item, idx) => (
          <List.Item
            key={idx}
            style={{
              height: "100%",
            }}
          >
            <UserItem user={item} />
          </List.Item>
        )}
      ></List>
    </Row>
  );
}
