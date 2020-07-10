import React from 'react';
import './App.css';
import 'materialize-css';
import {Switch, Route} from 'react-router-dom';
import Navbar from './components/navbar/navbar.component';
import MsgDisconnected from './components/msg-disconnected/msg-disconnected.component';
import Transaction from './pages/transaction/transaction.page';
import Tiers from './pages/tiers/tiers.page';

class App extends React.Component {
  state = {
    disconnected: 'Loading...',
    linkApi: 'http://localhost:3001/'
  }
  componentDidMount(){
    const {linkApi} = this.state;
    fetch(linkApi)
      .then(response => this.setState({disconnected: false}))
      .catch(err => this.setState({disconnected: 'Aplikasi tidak terhubung server.'}));
  }
  render(){
    const {linkApi, disconnected} = this.state;
    return (
      <div className="App">
        {
          (disconnected) ? <MsgDisconnected disconnected={disconnected}/> : null
        }
        
        <Navbar />
        <Switch>
            <Route exact path="/" component={() => <Transaction linkApi={linkApi} />}/>
            <Route path="/tiers" component={() => <Tiers linkApi={linkApi} />}/>
        </Switch>
      </div>
    );
  }
}

export default App;
