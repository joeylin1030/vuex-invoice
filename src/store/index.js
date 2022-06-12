import { createStore } from "vuex";
import db from "@/firebase/config";

export default createStore({
  state: {
    invoiceData: [],
    invoiceModel: null,
    modalActive: null,
    invoicesLoaded: null,
    currentInvoiceArray: null,
    editInvoice: null,
  },
  getters: {},
  mutations: {
    // 將獲取的 api 資料 push 給 state 中的 invoiceData
    SET_INVOICE_DATA(state, payload) {
      state.invoiceData.push(payload);
    },
    // 獲取點選的 Invoice 資料
    SET_CURRENT_INVOICE(state, payload) {
      state.currentInvoiceArray = state.invoiceData.filter((invoice) => {
        return invoice.invoiceId === payload;
      });
    },
    // 切換是否為編輯狀態
    TOGGLE_EDIT_INVOICE(state) {
      state.editInvoice = !state.editInvoice;
    },
    // 切換是否顯示 invoiceModel 新增與編輯的選單
    TOGGLE_INVOICE(state) {
      state.invoiceModel = !state.invoiceModel;
    },
    // 切換是否顯示 Model 彈窗
    TOGGLE_MODAL(state) {
      state.modalActive = !state.modalActive;
    },
    // 改變 invoicesLoaded 為 true
    INVOICES_LOADED(state) {
      state.invoicesLoaded = true;
    },
    // 刪除 invoiceData 選中的資料
    DELETE_INVOICE(state, payload) {
      state.invoiceData = state.invoiceData.filter(
        (invoice) => invoice.docId !== payload
      );
    },
    UPDATE_STATUS_TO_PAID(state, payload) {
      state.invoiceData.forEach((invoice) => {
        if (invoice.docId === payload) {
          invoice.invoicePaid = true;
          invoice.invoicePending = false;
        }
      });
    },
    UPDATE_STATUS_TO_PENDING(state, payload) {
      state.invoiceData.forEach((invoice) => {
        if (invoice.docId === payload) {
          invoice.invoicePaid = false;
          invoice.invoicePending = true;
          invoice.invoiceDraft = false;
        }
      });
    },
  },
  actions: {
    // 獲取 database 資料並觸發 commit
    async GET_INVOICES({ commit, state }) {
      const getData = db.collection("invoices");
      const res = await getData.get();
      res.forEach((doc) => {
        if (!state.invoiceData.some((inovice) => inovice.docId === doc.id)) {
          const data = {
            docId: doc.id,
            invoiceId: doc.data().invoiceId,
            billerStreetAddress: doc.data().billerStreetAddress,
            billerCity: doc.data().billerCity,
            billerZipCode: doc.data().billerZipCode,
            billerCountry: doc.data().billerCountry,
            clientName: doc.data().clientName,
            clientEmail: doc.data().clientEmail,
            clientStreetAddress: doc.data().clientStreetAddress,
            clientCity: doc.data().clientCity,
            clientZipCode: doc.data().clientZipCode,
            clientCountry: doc.data().clientCountry,
            invoiceDateUnix: doc.data().invoiceDateUnix,
            invoiceDate: doc.data().invoiceDate,
            paymentTerms: doc.data().paymentTerms,
            paymentDueDateUnix: doc.data().paymentDueDateUnix,
            paymentDueDate: doc.data().paymentDueDate,
            productDescription: doc.data().productDescription,
            invoiceItemList: doc.data().invoiceItemList,
            invoiceTotal: doc.data().invoiceTotal,
            invoicePending: doc.data().invoicePending,
            invoiceDraft: doc.data().invoiceDraft,
            invoicePaid: doc.data().invoicePaid,
          };
          commit("SET_INVOICE_DATA", data);
        }
      });
      commit("INVOICES_LOADED");
    },
    // 更新資料 :
    async UPDATE_INVOICE({ commit, dispatch }, { docId, routeId }) {
      commit("DELETE_INVOICE", docId); // 先清除已選取的資料
      await dispatch("GET_INVOICES"); // 重新請求 invoiceData 資料
      commit("TOGGLE_INVOICE"); // 顯示編輯選單
      commit("TOGGLE_EDIT_INVOICE"); // 切換成編輯狀態
      commit("SET_CURRENT_INVOICE", routeId); // 獲取已選取的資料
    },
    // 刪除已選取 ID 的資料
    async DELETE_INVOICE({ commit }, docId) {
      const getInvoice = db.collection("invoices").doc(docId);
      await getInvoice.delete();
      commit("DELETE_INVOICE", docId);
    },
    async UPDATE_STATUS_TO_PAID({ commit }, docId) {
      const getInvoice = db.collection("invoices").doc(docId);
      await getInvoice.update({
        invoicePaid: true,
        invoicePending: false,
      });
      commit("UPDATE_STATUS_TO_PAID", docId);
    },
    async UPDATE_STATUS_TO_PENDING({ commit }, docId) {
      const getInvoice = db.collection("invoices").doc(docId);
      await getInvoice.update({
        invoicePending: true,
        invoicePaid: false,
        invoiceDraft: false,
      });
      commit("UPDATE_STATUS_TO_PENDING", docId);
    },
  },
  modules: {},
});
