import {
  IonPage,
  IonButtons,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonButton,
  IonToolbar,
  IonHeader,
  IonListHeader,
  IonIcon,
  IonLabel,
  IonText,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { withRouter, RouteComponentProps, useParams } from 'react-router';
import classNames from 'classnames';
import { checkmarkOutline } from 'ionicons/icons';
import { CurrencyIcon, IconBack, TxIcon } from '../../components/icons';
import './style.scss';
import { useDispatch, useSelector } from 'react-redux';
import { explorerUrl } from '../../redux/services/walletService';
import { getTransactions } from '../../redux/actions/transactionsActions';
import { TxDisplayInterface, TxStatus } from '../../utils/types';
import { formatPriceString, getCoinsEquivalent } from '../../utils/helpers';

const txTypes = ['deposit', 'withdrawal', 'swap', 'trade'];
const statusText = {
  confirmed: 'completed',
  pending: 'pending',
};

const Operations: React.FC<RouteComponentProps> = ({ history }) => {
  const dispatch = useDispatch();
  const { address, assets, transactions, currency, coinsRates } = useSelector(
    (state: any) => ({
      assets: state.wallet.assets,
      transactions: state.transactions.data,
      address: state.wallet.address,
      coinsRates: state.wallet.coinsRates,
      currency: state.settings.currency,
    })
  );
  const [assetTransactions, setAssetTransactions] = useState<
    Array<TxDisplayInterface> | undefined
  >();
  const [assetData, setAssetData] = useState<any>();
  const { asset_id } = useParams();

  useEffect(() => {
    const fillAssetData = () => {
      const asset = assets.find((item: any) => item.asset_id === asset_id);
      const priceEquivalent = getCoinsEquivalent(
        asset,
        coinsRates,
        asset.amountDisplay,
        currency
      );
      const res = {
        asset_id,
        ticker: asset.ticker,
        amountDisplay: asset.amountDisplay,
        amountDisplayFormatted: asset.amountDisplayFormatted,
        name: asset.name,
        priceEquivalent: priceEquivalent
          ? formatPriceString(priceEquivalent)
          : priceEquivalent,
      };
      setAssetData(res);
    };

    if (assets && !transactions) {
      dispatch(
        getTransactions({
          confidentialAddress: address.confidentialAddress,
          privateBlindingKey: [address.blindingPrivateKey],
          explorerUrl,
        })
      );
    }
    fillAssetData();
  }, []);

  useEffect(() => {
    if (assetData && transactions && !assetTransactions) {
      const txs = transactions[asset_id].map((tx: TxDisplayInterface) => {
        const priceEquivalent = getCoinsEquivalent(
          assetData,
          coinsRates,
          tx.amountDisplay,
          currency
        );
        return {
          ...tx,
          priceEquivalent: priceEquivalent
            ? formatPriceString(priceEquivalent)
            : priceEquivalent,
          ticker: assetData.ticker,
        };
      });
      setAssetTransactions(txs);
    }
  }, [transactions, assetTransactions, assetData]);

  const toggleTxOpen = (idx: number) => {
    if (assetTransactions) {
      const txs = [...assetTransactions];
      txs[idx].open = !txs[idx].open;
      setAssetTransactions(txs);
    }
  };

  const renderStatus: any = (status: string) => {
    return status === 'pending' ? (
      <div className="status pending">
        PENDING{' '}
        <span className="three-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </span>
      </div>
    ) : (
      <div className="status confirmed">
        STATUS <IonIcon color="success" icon={checkmarkOutline}></IonIcon>
      </div>
    );
  };

  const renderStatusText: any = (status: string) => {
    switch (status) {
      case TxStatus.Confirmed:
        return (
          <span className="status-text confirmed">{statusText[status]}</span>
        );
      case TxStatus.Pending:
        return (
          <span className="status-text pending">{statusText[status]}</span>
        );
      default:
        return <span className="status-text pending" />;
    }
  };

  return (
    <IonPage>
      <div className="gradient-background"></div>
      <IonHeader className="header operations">
        <IonToolbar className="with-back-button">
          <IonButton
            style={{ zIndex: 10 }}
            onClick={() => {
              history.goBack();
            }}
          >
            <IconBack />
          </IonButton>
          <IonTitle>{assetData?.name}</IonTitle>
        </IonToolbar>
        <div className="header-info">
          <div className="img-wrapper">
            {assetData && <CurrencyIcon currency={assetData?.ticker} />}
          </div>
          <p className="info-amount">
            {assetData?.amountDisplayFormatted} <span>{assetData?.ticker}</span>
          </p>
          {assetData?.priceEquivalent && (
            <p className="info-amount-converted">
              {assetData.priceEquivalent} {currency.toUpperCase()}
            </p>
          )}
        </div>
        <IonButtons className="operations-buttons">
          <IonButton className="coin-action-button" routerLink="/recieve">
            Deposit
          </IonButton>
          <IonButton className="coin-action-button" routerLink="/withdraw">
            Withdraw
          </IonButton>
          <IonButton className="coin-action-button" routerLink="/swap">
            Swap
          </IonButton>
        </IonButtons>
      </IonHeader>
      <IonContent className="operations">
        <IonList>
          <IonListHeader>Transactions</IonListHeader>
          {assetTransactions?.map((tx: any, index: number) => (
            <IonItem
              onClick={() => toggleTxOpen(index)}
              className={classNames('list-item transaction-item', {
                open: tx.open,
              })}
            >
              <div className="info-wrapper">
                <div className="item-main-info">
                  <div className="item-start">
                    <div className="icon-wrapper">
                      <TxIcon type={tx.type} />
                    </div>
                    <div className="item-name">
                      <div className="main-row">
                        {tx.ticker} {txTypes[tx.type - 1]}
                      </div>
                      <div className="sub-row">
                        {tx.open ? tx.time : tx.date}
                      </div>
                    </div>
                  </div>
                  <div className="item-end">
                    <div className="amount">
                      <div className="main-row">
                        {tx.sign}
                        {tx.amountDisplayFormatted}
                      </div>
                      <div className="main-row accent">{tx.ticker}</div>
                    </div>
                    {tx.priceEquivalent && (
                      <div className="sub-row ta-end">
                        {tx.sign}
                        {tx.priceEquivalent} {currency.toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="sub-info">
                  <div className="fee-row">
                    <IonLabel>
                      Fee <span className="amount">{tx.fee}</span>
                    </IonLabel>
                    <IonText>{renderStatusText(tx.status)}</IonText>
                  </div>
                  <div className="info-row">
                    <IonLabel>ADDR</IonLabel>
                    {address && (
                      <IonText>{address.confidentialAddress}</IonText>
                    )}
                  </div>
                  <div className="info-row">
                    <IonLabel>TxID</IonLabel>
                    <IonText>{tx.txId}</IonText>
                  </div>
                </div>
              </div>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default withRouter(Operations);
