const redux = require("redux");
const thunkMiddleware = require("redux-thunk").default;
const axios = require("axios");
const createStore = redux.createStore;

const applyMiddleware = redux.applyMiddleware;

const combineReducers = redux.combineReducers;
const BUY_CAKE = "BUY_CAKE";

const BUY_ICECREAM = "BUY_ICECREAM";

function buyCake() {
  return {
    type: BUY_CAKE,
    info: "first redux action",
  };
}

function buyIcecream() {
  return {
    type: BUY_ICECREAM,
    info: "first redux action",
  };
}

//(previorsState,action)=>newState

const cakeInitialState = {
  numOfCakes: 10,
};

const icecreamInitialState = {
  numOfIceCreams: 20,
};

const cakeReducer = (state = cakeInitialState, action) => {
  switch (action.type) {
    case BUY_CAKE:
      return {
        //change only the required property
        ...state,
        numOfCakes: state.numOfCakes - 1,
      };
    default:
      return state;
  }
};

const icecreamReducer = (state = icecreamInitialState, action) => {
  switch (action.type) {
    case BUY_ICECREAM:
      return {
        //change only the required property
        ...state,
        numOfIceCreams: state.numOfIceCreams - 1,
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  cake: cakeReducer,
  icecream: icecreamReducer,
});
const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

const fetchUsers = () => {
  return function (dispatch) {
    dispatch(fetchUsersRequest());

    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        const user = response.data.map((user) => user.id);
        dispatch(fetchUsersSuccess(users));
      })
      .catch((error) => {});
  };
};
const store = createStore(reducer);
console.log("initial state", store.getState());

store.subscribe(() => console.log("updated State", store.getState()));

dispatch(fetchUsers());

store.dispatch(buyCake());
store.dispatch(buyCake());
store.dispatch(buyCake());
unsubscribe();
