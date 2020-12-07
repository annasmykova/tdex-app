import { TxInterface } from 'tdex-sdk';
import {
  formatPriceString,
  fromSatoshi,
  getDataFromTx,
} from '../../utils/helpers';
import { defaultPrecision } from '../../utils/constants';
import {
  TxDisplayInterface,
  TxsByAssetsInterface,
  TxStatus,
} from '../../utils/types';
import moment from 'moment';

export const transactionsTransformer = (txs: TxInterface[] | undefined) => {
  const txArray = txs?.map(
    (tx: TxInterface): TxDisplayInterface => {
      const {
        asset = '',
        type = 0,
        amount = 0,
        fee = '0,5',
        sign = '',
      } = getDataFromTx(tx.vin, tx.vout);
      return {
        txId: tx.txid,
        time: moment(
          new Date(tx.status.blockTime || '').toLocaleDateString(),
          'DD/MM/YYYY hh:mm:ss'
        ).format('DD MMM YYYY hh:mm:ss'),
        date: moment(
          new Date(tx.status.blockTime || '').toLocaleDateString(),
          'DD/MM/YYYY'
        ).format('DD MMM YYYY'),
        status: tx.status.confirmed ? TxStatus.Confirmed : TxStatus.Pending,
        type,
        asset,
        amount,
        amountDisplay: fromSatoshi(amount, defaultPrecision),
        amountDisplayFormatted: formatPriceString(
          fromSatoshi(amount, defaultPrecision)
        ),
        fee: fromSatoshi(tx.fee, defaultPrecision, 5),
        open: false,
        sign,
      };
    }
  );
  return txArray?.reduce(
    (
      res: TxsByAssetsInterface,
      tx: TxDisplayInterface
    ): TxsByAssetsInterface => {
      res[tx.asset] = res[tx.asset] ? [...res[tx.asset], tx] : [tx];
      return res;
    },
    {}
  );
};
