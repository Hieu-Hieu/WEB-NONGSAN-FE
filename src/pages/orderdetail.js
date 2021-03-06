import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import numberWithCommas from "../utils/numberWithCommas";

import Table from "../components/admin/Table";
import {
  orderDetail,
  payOrder,
  userUpdateOrderAction,
} from "../redux/actions/orderAction";
import axios from "axios";
import { PayPalButton } from "react-paypal-button-v2";
import { ORDER_PAY_RESET } from "../redux/constants/orderConstants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";

const OrderDetail = () => {

  const params = useParams();
  const orderId = params.id;

  const myInfo = useSelector((state) => state.userSignin);
  const { userInfo } = myInfo;

  const oDetail = useSelector((state) => state.orderDetail);
  const { order, loading, error } = oDetail;

  const [sdkReady, setSdkReady] = useState(false);
  const VND_To_USD = 23000;

  const dispatch = useDispatch();

  let link = "/order-history";
  const navigate = useNavigate()
  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      const addPayPalScript = async () => {
        const { data } = await axios.get("/v1/config/paypal");
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
        script.async = true;
        script.onload = () => {
          setSdkReady(true);
        };
        document.body.appendChild(script);
      };

      if (
        !order ||
        (order && (order.orderItems.length === 0 || order._id !== orderId))
      ) {
        // alert('233')
        dispatch({ type: ORDER_PAY_RESET });
        dispatch(orderDetail(orderId));
      } else if (order && !order.isPaid) {
        if (!window.paypal) {
          addPayPalScript();
        } else {
          setSdkReady(true);
        }
      }
    }

    // return () => {
    //   if (order && order.paymentMethod === 'Online' && !order.isPaid) {
    //     toast.info('Xin m???i qu?? kh??ch thanh to??n ????? ho??n t???t ????n h??ng!')
    //     console.log('134')
    //   }
    // }
  }, [dispatch, userInfo, orderId, sdkReady, order]);

  const successPaymentHnadler = (paymentResult) => {
    console.log(paymentResult);
    dispatch(payOrder(order, paymentResult));
  };

  const customerTableHead = [
    "H??nh ???nh",
    "S???n ph???m",
    "Gi??",
    "S??? L?????ng",
    "T???m t??nh",
  ];

  const trangthai = {
    DANG_XU_LY: "??ang x??? l??",
    CHO_GIAO: "Ch??? giao h??ng",
    DANG_GIAO: "??ang giao h??ng",
    DA_GIAO: "???? giao h??ng",
    DA_HUY: "???? h???y",
  };

  const renderHead = (item, index) => <th key={index}>{item}</th>;

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>
        <img
          style={{ width: "80px" }}
          src={item.product && item.product.images && item.product.images[0]}
          alt=""
        ></img>
      </td>
      {/* <td>{item.createdAt.substr(0, 10).split('-').reverse().join('/')}</td> */}
      <td>{item.product && item.product.name}</td>
      <td>{item.price && numberWithCommas(item.price)}??</td>
      <td>{item.quantity}</td>
      <td>
        {item.price &&
          item.quantity &&
          numberWithCommas(item.price * item.quantity)}
        ??
      </td>
    </tr>
  );
  //console.log(order)
  const fullAddress = (order) => {
    return (
      order.detail +
      ", " +
      order.ward +
      ", " +
      order.district +
      ", " +
      order.province
    );
  };

  useEffect(() => {
    if (order && order.paymentMethod === "Online" && !order.isPaid) {
      toast.info("Xin m???i qu?? kh??ch thanh to??n ????? ho??n t???t ????n h??ng!");
      console.log("134");
    }
  }, []);

  const handleBtnCancelOrder = (id) => {
    if (window.confirm("B???n mu???n h???y ????n h??ng n??y?")) {
      dispatch(userUpdateOrderAction({ id, status: "DA_HUY" }));
    }
  };

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={10000}
        hideProgressBar={true}
        newestOnTop={false}
      />

      <div className="row">
        <div className="col-8 col-md-12 col-sm-12">
          <div className="card">
            <h3 style={{ marginBottom: "20px" }}>Chi ti???t ????n h??ng</h3>
            <p style={{ marginBottom: "4px" }}>
              M?? ????n h??ng: #{order && order._id}
            </p>
            <p style={{ marginBottom: "10px" }}>
              Ng??y ?????t:{" "}
              {order &&
                order.createdAt &&
                order.createdAt.substr(0, 10).split("-").reverse().join("/")}
            </p>
            <div className="card__body">
              {loading ? (
                <div>Loading...</div>
              ) : error ? (
                <div>{error}</div>
              ) : order && order.length <= 0 ? (
                <div>Kh??ng c?? d??? li???u</div>
              ) : (
                <Table
                  limit="10"
                  headData={customerTableHead}
                  renderHead={(item, index) => renderHead(item, index)}
                  bodyData={order && order.orderItems}
                  renderBody={(item, index) => renderBody(item, index)}
                />
              )}
            </div>
          </div>
        </div>
        <div className="col-4 col-md-12 col-sm-12">
          <div className="card">
            <div className="order__shipping">
              <div className="order__shipping-title">
                {order && order.lastName + " " + order.firstName}
              </div>
            </div>
            <div className="order__price">
              <div className="order__price-title">
                ?????a ch???: {order && order.address && fullAddress(order.address)}
              </div>
            </div>
            <div className="order__payment">
              <div className="order__payment-item">
                <label for="COD">S??T: {order && order.phone}</label>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="order__shipping">
              <div className="order__shipping-title">Ph?? v???n chuy???n</div>
              <div className="order__shipping-fee">
                {numberWithCommas(30000)}??
              </div>
            </div>
            <div className="order__price">
              <div className="order__price-title">T???ng ti???n</div>
              <div className="order__price-total">
                {order &&
                  order.totalPrice &&
                  numberWithCommas(order.totalPrice)}
                ??
              </div>
            </div>
            <div className="order__payment">
              <div className="order__payment-item">
                <label>
                  Tr???ng th??i giao h??ng: {order && trangthai[order.status]}
                </label>
                {order && order.status === "DANG_XU_LY" && (
                  <>
                    <span style={{ margin: "4px" }}>|</span>
                    <button
                      onClick={() => handleBtnCancelOrder(order._id)}
                      style={{
                        fontWeight: 500,
                        backgroundColor: "#024137",
                        color: "#fff",
                        padding: "1px 4px",
                        borderRadius: "3px",
                      }}
                    >
                      H???y
                    </button>
                  </>
                )}
              </div>
              <div className="order__payment-item">
                <label>
                  Thanh to??n:
                  {order && order.isPaid ? (
                    <span style={{ color: "red" }}>
                      {`???? thanh to??n (${order.paidAt
                        .substr(0, 10)
                        .split("-")
                        .reverse()
                        .join("/")})`}
                    </span>
                  ) : (
                    "Ch??a thanh to??n"
                  )}
                </label>
              </div>
              <div className="order__payment-item">
                <label>Lo???i thanh to??n: {order && order.paymentMethod}</label>
              </div>
              <div className="">
                {order && order.paymentMethod === "Online" && !order.isPaid && (
                  <div>
                    <span style={{ color: "red" }}>
                      Xin m???i qu?? kh??ch thanh to??n ????? ho??n t???t ????n h??ng
                    </span>
                    <ul>
                      <li>
                        {!sdkReady ? (
                          <div>Loading...</div>
                        ) : (
                          <PayPalButton
                            amount={(order.totalPrice / VND_To_USD).toFixed(2)}
                            onSuccess={successPaymentHnadler}
                          ></PayPalButton>
                        )}
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <div className="order__button">
                <button
                  className="order__button-checkout"
                  onClick={() => {
                    navigate(link)
                  }}
                >
                  ????n h??ng ???? mua
                </button>
                <button
                  className="order__button-checkout"
                  onClick={() => {
                    navigate("/catalog");
                  }}
                >
                  Ti???p t???c mua h??ng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
