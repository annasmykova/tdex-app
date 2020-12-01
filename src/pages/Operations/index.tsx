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
} from '@ionic/react';
import React, { useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import classNames from 'classnames';
import { checkmarkOutline } from 'ionicons/icons';
import { IconBack, IconBTC } from '../../components/icons';
import './style.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTxs, TxInterface, unblindTransaction } from 'tdex-sdk';
import { explorerUrl } from '../../redux/services/walletService';
import { script, confidential } from 'liquidjs-lib';
import { getTransactions } from '../../redux/actionTypes/transactionsActionTypes';

const Operations: React.FC<RouteComponentProps> = ({ history }) => {
  const address = useSelector((state: any) => state.wallet.address);
  const dispatch = useDispatch();

  useEffect(() => {
    getTxs(address.confidentialAddress).then(
      (res: TxInterface[] | undefined) => {
        console.log(res);
        const unblindTxs = res?.map((tx) => {
          const unblindTx = unblindTransaction(tx, [
            address.blindingPrivateKey,
          ]);
          console.log(
            new Date(unblindTx.status?.block_time).toLocaleDateString()
          );
          unblindTx?.vout.forEach((vout) => {
            if (vout?.txOutput) {
              console.log(script.decompile(vout.txOutput.asset));
              if (confidential.isUnconfidentialValue(vout.txOutput.value)) {
                console.log(
                  confidential.confidentialValueToSatoshi(vout.txOutput.value)
                );
              }
            }
          });
          console.log(unblindTx);
          return unblindTx;
        });
        console.log(unblindTxs);
        // dispatch(getTransactions(res));
      }
    );
  }, []);

  const getTxs = async (confidentialAddress: string) => {
    try {
      console.log(confidentialAddress);
      const txs = await fetchTxs(confidentialAddress, explorerUrl);
      console.log(txs);
      return txs;
    } catch (e) {
      console.log(e);
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
          <IonTitle>BTC BITCOIN</IonTitle>
        </IonToolbar>
        <div className="header-info">
          <div className="img-wrapper">
            <IconBTC width="48px" height="48px"></IconBTC>
          </div>
          <p className="info-amount">
            10,00 <span>BTC</span>
          </p>
          <p className="info-amount-converted">114,000,80 EUR</p>
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
          <IonItem className="list-item">
            <div className="info-wrapper">
              <div className="item-main-info">
                <div className="item-start">
                  <div className="swap-images">
                    <span className="icon-wrapper">
                      <IconBTC width="13px" height="13px"></IconBTC>
                    </span>
                    <span className="icon-wrapper with-border">
                      <IconBTC width="13px" height="13px"></IconBTC>
                    </span>
                  </div>
                  <div className="item-name">
                    <div className="main-row">BTC / USDT</div>
                    <div className="sub-row">12 Sep 2020</div>
                  </div>
                </div>
                <div className="item-end">
                  <div className="first-col">
                    <div className="main-row">3,00</div>
                    <div className="sub-row">24,00</div>
                  </div>
                  <div className="second-col">
                    <div className="main-row accent">BTC</div>
                    <div className="sub-row">EUR</div>
                  </div>
                </div>
              </div>
            </div>
          </IonItem>
          <IonItem
            className={classNames('list-item transaction-item', {
              pending: true,
            })}
            onClick={() => {
              history.push('/operations');
            }}
          >
            <div className="info-wrapper">
              <div className="item-main-info">
                <div className="item-start">
                  <div className="swap-images">
                    <span className="icon-wrapper">
                      <IconBTC width="13px" height="13px"></IconBTC>
                    </span>
                    <span className="icon-wrapper with-border">
                      <IconBTC width="13px" height="13px"></IconBTC>
                    </span>
                  </div>
                  <div className="item-name">
                    <div className="main-row">BTC / USDT</div>
                    <div className="sub-row">12 Sep 2020</div>
                  </div>
                </div>
                <div className="item-end">
                  <div className="amount">
                    <div className="main-row">+3.001,00 </div>
                    <div className="main-row accent">USDT</div>
                  </div>
                  {renderStatus('confirmed')}
                </div>
              </div>
            </div>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default withRouter(Operations);
