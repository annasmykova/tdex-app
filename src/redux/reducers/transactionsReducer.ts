import { ActionType } from '../../utils/types';
import { SET_TRANSACTIONS } from '../actionTypes/transactionsActionTypes';

const initialState = {
  transactions: null,
};

const TransactionsReducer = (state: any = initialState, action: ActionType) => {
  switch (action.type) {
    case SET_TRANSACTIONS:
      return { ...state, transactions: action.payload };
    default:
      return state;
  }
};

export default TransactionsReducer;
