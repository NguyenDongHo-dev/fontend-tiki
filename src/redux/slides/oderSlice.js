import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderItems: [],
  orderItemsSlected: [],
  shippingAddress: {},
  paymentMethod: "",
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
  user: "",
  isPaid: false,
  paiAt: "",
  isDelivered: false,
  deliveredAt: "",
  isErrorOrder: false,
  isSuccessOrder: false,
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOrder: (state, action) => {
      const { orderItem } = action.payload;
      const itemOrder = state?.orderItems?.find(
        (item) => item.product === orderItem.product
      );
      if (itemOrder) {
        if (itemOrder.amount <= itemOrder.countInStrock) {
          itemOrder.amount += orderItem?.amount;
          state.isSuccessOrder = true;
          state.isErrorOrder = false;
        } else {
          state.isErrorOrder = true;
        }
      } else {
        state.orderItems.push(orderItem);
      }
    },
    resetOrder: (state) => {
      state.isSuccessOrder = false;
    },

    setAmountItem: (state, action) => {
      const { idProduct, amount } = action.payload;
      const itemOrder = state?.orderItems?.find(
        (item) => item?.product === idProduct
      );
      
      if (itemOrder) {
        if (amount > itemOrder.countInStrock) {
          itemOrder.amount = itemOrder.countInStrock;
        } else itemOrder.amount = amount;
      }
    },

    increaseAmount: (state, action) => {
      const { idProduct } = action.payload;
      const itemOrder = state?.orderItems?.find(
        (item) => item?.product === idProduct
      );
      const itemOrderSelected = state?.orderItemsSlected?.find(
        (item) => item?.product === idProduct
      );
      itemOrder.amount++;
      if (itemOrderSelected) {
        itemOrderSelected.amount++;
      }
    },
    decreaseAmount: (state, action) => {
      const { idProduct } = action.payload;
      const itemOrder = state?.orderItems?.find(
        (item) => item?.product === idProduct
      );
      const itemOrderSelected = state?.orderItemsSlected?.find(
        (item) => item?.product === idProduct
      );
      itemOrder.amount--;
      if (itemOrderSelected) {
        itemOrderSelected.amount--;
      }
    },
    removeOrder: (state, action) => {
      const { idProduct } = action.payload;
      const itemOrder = state.orderItems?.filter(
        (item) => item.product !== idProduct
      );

      const itemOrderSelected = state?.orderItemsSlected?.filter(
        (item) => item?.product !== idProduct
      );
      state.orderItems = itemOrder;
      state.orderItemsSlected = itemOrderSelected;
    },

    removeAllOrder: (state, action) => {
      const { listChecked } = action.payload;
      const itemOrders = state?.orderItems?.filter(
        (item) => !listChecked.includes(item?.product)
      );
      const itemOrderSelected = state?.orderItemsSlected?.filter(
        (item) => !listChecked.includes(item?.product)
      );
      state.orderItems = itemOrders;
      state.orderItemsSlected = itemOrderSelected;
    },

    selectedOrder: (state, action) => {
      const { listChecked } = action.payload;
      const orderSelected = [];
      state.orderItems.forEach((order) => {
        if (listChecked.includes(order.product)) {
          orderSelected.push(order);
        }
      });
      state.orderItemsSlected = orderSelected;
    },
    resetOrder: (state) => {
      state.orderItems = [];
      state.orderItemsSlected = [];
      state.shippingAddress = {};
      state.paymentMethod = "";
      state.itemsPrice = 0;
      state.shippingPrice = 0;
      state.taxPrice = 0;
      state.totalPrice = 0;
      state.user = "";
      state.isPaid = false;
      state.paiAt = "";
      state.isDelivered = false;
      state.deliveredAt = "";
      state.isErrorOrder = false;
      state.isSuccessOrder = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  removeAllOrder,
  addOrder,
  removeOrder,
  increaseAmount,
  decreaseAmount,
  selectedOrder,
  resetOrder,
  setAmountItem,
} = orderSlice.actions;

export default orderSlice.reducer;
