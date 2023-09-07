import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import PageContainer from "../../components/PageContainer";
import { getContactInfo } from "../../services/api";
import "./index.less";

const routes = [
  {
    path: "/client",
    breadcrumbName: "首页",
  },
  {
    path: "/client/contact",
    breadcrumbName: "联系我们",
  },
];

const Contact: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    setLoading(true);
    getContactInfo().then((res) => {
      if (res.state) {
        setData(res.data);
      }
      setLoading(false);
    });
  }, []);

  return (
    <PageContainer routes={routes} loading={loading}>
      <div className="contact-page">
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <div dangerouslySetInnerHTML={{ __html: data?.Con }}></div>
            {/* <div className="descriptions">
              <div className="descriptions-header">
                <div className="descriptions-title">联系我们</div>
              </div>

              <div className="descriptions-item tel">
                <div className="descriptions-item-label">电话</div>
                <div className="descriptions-item-content">
                  0510-86015188 / 81629979
                </div>
              </div>

              <div className="descriptions-item mail">
                <div className="descriptions-item-label">邮箱</div>
                <div className="descriptions-item-content">
                  bcchem@bcchem.com
                </div>
              </div>

              <div className="descriptions-item address">
                <div className="descriptions-item-label">地址</div>
                <div className="descriptions-item-content">
                  江苏省江阴市云亭街道建设路55号
                </div>
              </div>

              <div className="descriptions-item postcode">
                <div className="descriptions-item-label">邮编</div>
                <div className="descriptions-item-content">214422</div>
              </div>
            </div> */}
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            地图
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
};

export default Contact;
