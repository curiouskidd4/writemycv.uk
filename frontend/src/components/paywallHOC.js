// HOC Component to check if user has subscription or not
// If user has subscription, then render the component
// If user does not have subscription, then render the paywall component

import React, { useEffect } from "react";
import { useAuth } from "../contexts/authContext";
import { Button, Row, Space } from "antd";
import { Link } from "react-router-dom";

const withPaywall = (Component) => {
  const Paywall = (props) => {
    const auth = useAuth();

    // if (auth.user && auth.user.subscriptionId) {
    //   return <Component {...props} />;
    // } else {
    //   return (
    //     <div
    //       style={{
    //         padding: "8px",
    //       }}
    //     >
    //       <Space direction="vertical" size="middle">
    //         <Row>Upgrade to use CV Wizard</Row>
    //         <Row justify="center">
    //             <Link to="/upgrade">
    //           <Button type="primary">See Plans</Button>
    //             </Link>
    //         </Row>
    //       </Space>
    //     </div>
    //   );
    // }
    return <Component {...props} />;
  };

  return Paywall;
};

export default withPaywall;
