import Vue from "vue";
import axios from "axios";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
  },
  mutations: {
    SET_USER_DATA(state, userData) {
      state.user = userData;
      localStorage.setItem("user", JSON.stringify(userData));
      axios.defaults.headers.common["Authorization"] = `Bearer ${
        userData.token
      }`;
    },
    LOGOUT(state) {
      // state.user = null;
      localStorage.removeItem("user");
      // axios.defaults.headers.common["Authorization"] = null;
      location.reload();
    },
  },
  actions: {
    register({ commit }, credentials) {
      return axios
        .post("//localhost:3000/register", credentials)
        .then(({ data }) => {
          console.log("user data is", data);
          commit("SET_USER_DATA", data);
        });
    },
    async login({ commit }, credentials) {
      const { data } = await axios.post("//localhost:3000/login", credentials);
      commit("SET_USER_DATA", data);
    },
    logout({ commit }) {
      commit("LOGOUT");
    },
  },
  getters: {
    loggedIn(state) {
      return !!state.user;
    },
  },
});
