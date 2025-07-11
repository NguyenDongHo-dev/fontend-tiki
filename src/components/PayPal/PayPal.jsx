import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutationHook } from "../../hooks/UserMutationHook";
import { createOrder } from "../../services/OrderService";
import { removeAllOrder } from "../../redux/slides/oderSlice";
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPal = ({ priceMemo, totalPriceMemo }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const order = useSelector((state) => state.order);

  const mutationAddOrder = useMutationHook((data) => {
    const { access_token, ...rests } = data;
    return createOrder(access_token, rests);
  });

  const { isSuccess, isError, data: dataAdd } = mutationAddOrder;

  useEffect(() => {
    if (isSuccess && dataAdd?.status === "OK") {
      const arrayOrder = [];
      order?.orderItemsSlected?.forEach((element) => {
        arrayOrder.push(element.product);
      });
      dispatch(removeAllOrder({ listChecked: arrayOrder }));
      alert("Đặt hàng thành công");
      navigate("/ordersuccess", {
        state: {
          totalPriceMemo: totalPriceMemo,
          order: order?.orderItemsSlected,
          methon: "Paypal",
        },
      });
    } else if (isError) {
      alert("Đặt hành thất bại");
    }
  }, [isSuccess, isError]);

  

  return (
    <PayPalScriptProvider options={{ "client-id": process.env.PAYPAL_CLIENT_ID, currency: "CAD" }}>
      
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: Math.round(totalPriceMemo / 30000).toString(), // PayPal expects string
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then((details) => {
            // Khi thanh toán thành công → gọi mutationAddOrder
            mutationAddOrder.mutate({
              access_token: user?.access_token,
              orderItems: order?.orderItemsSlected,
              fullName: user?.name,
              address: user?.address,
              phone: user?.phone,
              itemsPrice: priceMemo,
              totalPrice: totalPriceMemo,
              user: user?.id,
              isPaid: true,
              paiAt: details.update_time,
              paymentMethod: "paypal",
              email: user?.email,
            });
          });
        }}
        onError={(err) => {
          console.error("PayPal Error:", err);
          alert("Thanh toán thất bại!");
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPal;
