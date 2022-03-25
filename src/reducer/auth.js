import { updateObject } from './utility';

const initialState = {
    user: null
};

const reducer = (state = initialState, action) => {
   switch (action.type) {
      case 'LOGIN': return updateObject(state, { user: action.payload });
      default: return state;
   }
}
export default reducer;
