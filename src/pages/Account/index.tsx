import { Breadcrumb, Divider, Popconfirm, message } from "antd";
import React, { useCallback, useReducer } from "react";
import { useHistory } from "react-router";
import { useAsync } from "../../lib/hooks";
import { getCurrentUserInfo, unBindWX } from "../../services/login";
import MenuHeader from "./Header";
import styles from "./index.module.scss";

const Account: React.FC = () => {
  const [x, forceUpdate] = useReducer((x) => x + 1, 1);

  const requestUserInfo = useCallback(async () => {
    if (x) {
      return await getCurrentUserInfo();
    }
    return undefined;
  }, [x]);

  const userInfo = useAsync(requestUserInfo);

  const routeHistory = useHistory();

  const onBind = async () => {
    await unBindWX();
    forceUpdate();
    message.success("解绑成功");
  };

  const onChangePassword = () => routeHistory.push("/forgot-password");

  return (
    <div className={styles.container}>
      <MenuHeader userData={userInfo} />
      <Breadcrumb className={styles.breadcrumb}>
        <Breadcrumb.Item>客户中心</Breadcrumb.Item>
        <Breadcrumb.Item>账号管理</Breadcrumb.Item>
      </Breadcrumb>
      <div className={styles.content}>
        <div className={styles.title}>账号详情</div>
        <Divider orientation="left" className={styles.divider}>
          基本信息
        </Divider>
        <div className={styles.detail}>
          <div className={styles.field}>
            <div className={styles.label}>联系人名称</div>
            <div className={styles.value}>{userInfo?.name}</div>
          </div>
          <div className={styles.field}>
            <div className={styles.label}>联系人手机</div>
            <div className={styles.value}>{userInfo?.cellphone}</div>
          </div>
          <div className={styles.field}>
            <div className={styles.label}>账号</div>
            <div className={styles.value}>{userInfo?.username}</div>
          </div>
          <div className={styles.field}>
            <div className={styles.label}>密码</div>
            <div className={styles.value}>
              <span>**********</span>
              <span className={styles.action} onClick={onChangePassword}>
                修改密码
              </span>
            </div>
          </div>
          <div className={styles.field}>
            <div className={styles.label}>微信</div>
            <div className={styles.value}>
              {userInfo?.weixinIdentity ? (
                <>
                  <img
                    src={userInfo?.weixinIdentity?.avatarUrl}
                    className={styles.wxAvatar}
                  />
                  <span className={styles.wxName}>
                    {userInfo?.weixinIdentity?.nickname}
                  </span>
                  <Popconfirm
                    title="你确定要解绑该微信吗？"
                    onConfirm={onBind}
                    okText="确定"
                    cancelText="取消"
                  >
                    <span className={styles.action}>解绑微信</span>
                  </Popconfirm>
                </>
              ) : (
                <span>未绑定</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
