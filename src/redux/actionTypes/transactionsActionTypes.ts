import { TxInterface } from 'tdex-sdk';

export const GET_TRANSACTIONS = 'GET_TRANSACTIONS';
export const SET_TRANSACTIONS = 'SET_TRANSACTIONS';

export const getTransactions = (
  blindTransactions: TxInterface[] | undefined
) => {
  return {
    type: GET_TRANSACTIONS,
    payload: blindTransactions,
  };
};

export const setTransactions = (transactions: any) => {
  return {
    type: SET_TRANSACTIONS,
    payload: transactions,
  };
};
