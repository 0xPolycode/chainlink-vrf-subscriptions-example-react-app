import React, { useEffect, useState } from 'react';
import './App.css';
import { PolycodeSDK, VRFCoordinator } from 'polycode-sdk';

const sdk = new PolycodeSDK(
  "cULb/.NGU7SYhiDF5VlQA0bKK07bV83RMNEj+XcD5KGVu",
  "3141e2b5-7849-47c9-8e0e-7222348f1935"
);

function App () {
  const [coordinator, setCoordinator] = useState(null);
  const [coordinatorConfig, setCoordinatorConfig] = useState(null);
  const [coordinatorTotalBalance, setCoordinatorTotalBalance] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [inputId, setInputId] = useState('');
  const [inputAmount, setInputAmount] = useState('');
  const [inputOwner, setInputOwner] = useState('');
  const [inputAddress, setInputAddress] = useState('');
  const [inputAddConsumer, setInputAddConsumer] = useState('');
  const [inputRemoveConsumer, setInputRemoveConsumer] = useState('');

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const coordinator = new VRFCoordinator();
    await coordinator.init();
    setCoordinator(coordinator);
    setCoordinatorTotalBalance(await coordinator.getTotalBalance());
  }


  // Function to handle the button click and fetch data
  const createSubscription = async () => {
    setCoordinator(coordinator);
    const subscription = await coordinator.createSubscription();
    setSubscription(subscription);
  };


  const getSubscription = async () => {
    const subscription = await coordinator.getSubscription(inputId);
    setSubscription(subscription);
  };

  const getCoordinatorConfig = async () => {
    const coordinatorConfig = await coordinator.getConfig();
    setCoordinatorConfig(coordinatorConfig);
  };

  const handleFund = async () => {
    const action = await subscription.fund(inputAmount);
    await action.present();
  };

  const handleCancel = () => {
    subscription.cancel(inputAddress);
  };

  const handleOwnerCancel = () => {
    subscription.ownerCancel();
  };

  const handleAddConsumer = async () => {
    const action = await subscription.addConsumer(inputAddConsumer);
    await action.present();
    getSubscription();
  };

  const handleRemoveConsumer = () => {
    subscription.removeConsumer(inputAddConsumer);
  };

  const handleAcceptSubscriptionOwnerTransfer = () => {
    subscription.acceptSubscriptionOwnerTransfer();
  };

  const handleRequestSubscriptionOwnerTransfer = () => {
    subscription.requestSubscriptionOwnerTransfer(inputOwner);
  };

  return (
    <div className="App">
      <div className='network'>
        <h2>This app is running on the Sepolia test network</h2>
      </div>
      <h1>VRFCoordinator Info</h1>
      <div>
        { coordinatorConfig && 
          <table>
            <thead>
              <tr>
                <th>Address</th>
                <th>Total Balance</th>
                <th>Minimum Request Confirmations</th>
                <th>Maximum Gas Limit</th>
                <th>Staleness Seconds</th>
                <th>Gas After Payment Calculation</th>
              </tr>
            </thead>
            <tbody>
                <tr key={coordinator.address}>
                  <td>{coordinator.address}</td>
                  <td>{coordinatorTotalBalance}</td>
                  <td>{coordinatorConfig.minimumRequestConfirmations}</td>
                  <td>{coordinatorConfig.maxGasLimit}</td>
                  <td>{coordinatorConfig.stalenessSeconds}</td>
                  <td>{coordinatorConfig.gasAfterPaymentCalculation}</td>
                </tr>
            </tbody>
          </table>
        }
        <button onClick={getCoordinatorConfig}>Get Coordinator Config</button>
      </div>
      <h1>Subscription Info & Management</h1>
      {subscription && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Balance</th>
              <th>Request Count</th>
              <th>Owner</th>
              <th>Consumers</th>
            </tr>
          </thead>
          <tbody>
              <tr key={subscription.id}>
                <td>{subscription.id}</td>
                <td>{subscription.balance}</td>
                <td>{subscription.requestCount}</td>
                <td>{subscription.owner}</td>
                <td>{subscription.consumers.join(', ')}</td>
              </tr>
          </tbody>
        </table>
      )}
      <div className="subscription">
        <div>
          <input
            type="number"
            placeholder="Subscription ID"
            value={inputId}
            onChange={e => setInputId(e.target.value)}
          />
          { !inputId && <button onClick={createSubscription}>Create Subscription</button> }
          { inputId && <button onClick={getSubscription}>Get Subscription</button> }
        </div>
      </div>
      {subscription &&
      <>
        <div className='management'>
            <div>
              <input
                type="number"
                placeholder="Amount"
                value={inputAmount}
                onChange={e => setInputAmount(e.target.value )}
              />
              <button onClick={handleFund}>Fund</button>
            </div>
            <div>
              <input
                type="text"
                placeholder="Recipient Address"
                value={inputAddress}
                onChange={e => setInputAddress(e.target.value )}
              />
              <button onClick={handleCancel}>Cancel</button>
            </div>
            <div>
              <input
                type="text"
                placeholder="Consumer Address"
                value={inputAddConsumer}
                onChange={e => setInputAddConsumer(e.target.value )}
              />
              <button onClick={handleAddConsumer}>Add Consumer</button>
            </div>
            <div>
              <input
                type="text"
                placeholder="Consumer Address"
                value={inputRemoveConsumer}
                onChange={e => setInputRemoveConsumer(e.target.value )}
              />
              <button onClick={handleRemoveConsumer}>Remove Consumer</button>
            </div>
            <div>
              <input
                type="text"
                placeholder="New Owner Address"
                value={inputOwner}
                onChange={e => setInputOwner(e.target.value )}
              />
              <button onClick={handleRequestSubscriptionOwnerTransfer}>Request Subscription Owner Transfer</button>
            </div>
            <div>
              <button onClick={handleAcceptSubscriptionOwnerTransfer}>Accept Subscription Owner Transfer</button>
            </div>
            <div>
              <button onClick={handleOwnerCancel}>Owner Cancel</button>
            </div>
        </div>
      </>
      }
    </div>
  );
}

export default App;
