import React, { Component } from "react";
//import SimpleStorageContract from '../build/contracts/CBR.json'
import getWeb3 from "./utils/getWeb3";
//import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import "rc-slider/assets/index.css";
// import Ping from "ping.js";
import MediaQuery from "react-responsive";
import ping from 'web-pingjs';
//import '../EUservers/Lucifer/public/sc-codec-min-bin.js'
import { withAlert } from "react-alert";
import ReactModal from "react-modal";
import "./css/oswald.css";
import "./css/open-sans.css";
import "./css/pure-min.css";
import "./App.css";
import { states } from "./constant";

var ReactBsTable = require("react-bootstrap-table");
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;

const address = "0x9dda40dabd849bbb087dcbcf0c5223ec5ffa0ad7";
// const ropstenAddress = "0x6853575b45e1C87081c566E875866255CFe4BF95";
const ropstenAddress = "0xa2a20b23318563b890793939c0e4158d12e58507";
const frontend_endPoint = "http://localhost:3000/";
const backend_endPoint = "http://localhost:5001/";



const SimpleStorageContract = require('./contract.json');

class App extends Component {
  constructor(props) {
    super(props);
    this.p = new ping();
    this.state = {
      storageValue: 0,
      itemName: "",
      itemPrice: 0,
      itemCategory: "",
      tadTax: 10,
      govTax: 10,
      govFunds: 0,
      totalSupply: 0,
      addAmount: 0,
      panel: 0,
      govTaxAmount: 0,
      tadTaxAmount: 0,
      governors: [
        // { id: 1, name: "Random Player" },
        // { id: 2, name: "Random Player" },
        // { id: 3, name: "Random Player" },
        // { id: 4, name: "Random Player" }
      ],
      exchangeValues: [
        { currency: "USD", price: 5 },
        { currency: "GBP", price: 5 },
        { currency: "VND", price: 5 },
        { currency: "AUD", price: 5 }
      ],
      ledger: [{ user: "player1", buy: "item", price: 55 }],
      web3: null,
      europePing: 0,
      asiaPing: 0,
      usPing: 0,
      jackpot: 500000,
      coinbase: "",
      regionSelected: 0,
      transactionStage: 3,
      wrappedEth: "0",
      itemList: [],
      auctionList: [],
      ticketList: [
        { user: "0x00000", numbers: [5, 3, 21, 45, 12, 33] },
        { user: "0x00000", numbers: [5, 3, 21, 45, 12, 33] },
        { user: "0x00000", numbers: [5, 3, 21, 45, 12, 33] },
        { user: "0x00000", numbers: [5, 3, 21, 45, 12, 33] }
      ],
      winningNumbers: [7, 7, 7, 7, 7, 7],
      convertAmount: 0,
      curCurrency: "",
      wrapReq: 0.005,
      showModal: false,
      showtadModal: false,
      showGovModal: false,
      govName: "",
      govNumber: 0,
      currencyVal: 0,
      showCurrencyModal: false,
      showInfoModal: false,
      refLink: null,
      network: 0,
      widgetOpen: true,
      profileOpen: false,
    };
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleTadOpenModal = this.handleTadOpenModal.bind(this);
    this.handleTadCloseModal = this.handleTadCloseModal.bind(this);
    this.handleGovOpenModal = this.handleGovOpenModal.bind(this);
    this.handleGovCloseModal = this.handleGovCloseModal.bind(this);
    this.handleCurrencyOpenModal = this.handleCurrencyOpenModal.bind(this);
    this.handleCurrencyCloseModal = this.handleCurrencyCloseModal.bind(this);
    this.handleInfoOpenModal = this.handleInfoOpenModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addSupply = this.addSupply.bind(this);
    this.buttonFormatter = this.buttonFormatter.bind(this);
    this.buttonCurrencyFormatter = this.buttonCurrencyFormatter.bind(this);
    this.handleGovNameChange = this.handleGovNameChange.bind(this);
    this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
    this.switchPanel = this.switchPanel.bind(this);
    this.winningNumberUp = this.winningNumberUp.bind(this);
    this.winningNumberDown = this.winningNumberDown.bind(this);
    this.calcPayout = this.calcPayout.bind(this);
    this.randomizeWinner = this.randomizeWinner.bind(this);
    this.setNumbers = this.setNumbers.bind(this);
    this.createItem = this.createItem.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  handleTadOpenModal() {
    this.setState({ showtadModal: true });
  }

  handleTadCloseModal() {
    this.setState({ showtadModal: false });
  }

  handleGovOpenModal(val) {
    this.setState({ showGovModal: true, govNumber: val });
  }

  handleGovCloseModal() {
    this.setState({ showGovModal: false });
  }

  handleCurrencyOpenModal(val) {
    this.setState({ showCurrencyModal: true, curCurrency: val });
  }

  handleCurrencyCloseModal() {
    this.setState({ showCurrencyModal: false });
  }

  handleInfoOpenModal() {
    this.setState({ showInfoModal: true });
  }

  handleInfoCloseModal() {
    this.setState({ showInfoModal: false });
  }

  handleChange(event) {
    this.setState({ addAmount: event.target.value });
  }

  handleGovChange(event) {
    this.setState({ govTaxAmount: event.target.value });
  }

  handleTadChange =(event)=> {
    this.setState({ tadTaxAmount: event.target.value });
  }

  handleGovNameChange(event) {
    this.setState({ govName: event.target.value });
  }

  handleCurrencyChange(event) {
    this.setState({ currencyVal: event.target.value });
  }

  handleNameChange(event) {
    this.setState({ itemName: event.target.value });
  }

  handlePriceChange(event) {
    this.setState({ itemPrice: event.target.value });
  }

  handleCategoryChange(event) {
    this.setState({ itemCategory: event.target.value });
  }

  handleClick() {
    this.setState({ isShowingRoyaleModal: true });
  }

  handleClose = () => this.setState({ isShowingRoyaleModal: false });
  
  handletadCloseModal = () => this.setState({showtadModal: false});

  componentDidMount() {
    ReactModal.setAppElement("body");

    fetch(backend_endPoint + "getNumbers/", {
      method: "post",
      //mode: 'no-cors',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        currency: this.state.curCurrency,
        price: this.state.currencyVal
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log("data" + data);
        this.setState({ winningNumbers: data });
      })
      .catch(function(err) {});

    fetch(backend_endPoint + "getItems/", {
      method: "get",
      //mode: 'no-cors',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.setState({ itemList: data });
      })
      .catch(function(err) {});

    fetch(backend_endPoint + "getAuction/", {
      method: "get",
      //mode: 'no-cors',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log("data" + data);
        this.setState({ auctionList: data });
      })
      .catch(function(err) {});
  }

  createItem() {
    console.log("CReating");
    fetch(backend_endPoint + "createItem/", {
      method: "post",
      //mode: 'no-cors',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: this.state.itemName,
        price: this.state.itemPrice,
        category: this.state.itemCategory
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log("data" + data);
        //this.setState({winningNumbers: data});
      })
      .catch(function(err) {});
  }

  componentWillMount() {
    console.log(" component will Mount =>",SimpleStorageContract);
    //var that = this;
    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        });
        console.log(results.web3);
        var that = this;
        //this.instantiateContract();
        // results.web3.eth.net.getId().then(function(res) {
        //   if (res === 3) {
        //     that.instantiateRopstenContract();
        //     that.setState({ network: res });
        //   } else {
        //     that.instantiateContract();
        //     //that.scrapeKyber();
        //   }
        // });
        results.web3.version.getNetwork((err, netId) => {
          if (netId == 3) {
            that.instantiateRopstenContract();
            that.setState({ network: netId });
          } else {
            that.instantiateContract();
            //that.scrapeKyber();
          }
        });
      })
      .catch((e) => {
        console.log("Error finding web3."+e);
      });
  }

  setNumbers() {
    fetch(backend_endPoint + "setNumbers/", {
      method: "post",
      //mode: 'no-cors',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        numbers: this.state.winningNumbers,
        price: this.state.currencyVal
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log("data" + data);
      })
      .catch(function(err) {});
  }

  instantiateContract() {
    const contract = require("truffle-contract");
    const simpleStorage = contract(SimpleStorageContract);
    simpleStorage.setProvider(this.state.web3.currentProvider);

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance;

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage
        .at(address)
        .then(instance => {
          simpleStorageInstance = instance;
          this.setState({ coinbase: accounts[0] });
          // Stores a given value, 5 by default.
          return simpleStorageInstance.balanceOf(accounts[0]);
        })
        .then(result => {
          this.setState({
            wrappedEth: this.state.web3.fromWei(
              result.toString(),
              "ether"
            )
          });
        });
    });
  }

  instantiateRopstenContract() {
    const contract = require("truffle-contract");
    const simpleStorage = contract(SimpleStorageContract);
    simpleStorage.setProvider(this.state.web3.currentProvider);

    fetch(backend_endPoint + "test/", {
      method: "post",
      //mode: 'no-cors',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ref: window.location.href.substr(
          window.location.href.length - 6,
          window.location.href.length - 1
        )
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log("data", data);
        this.setState({ exchangeValues: data });
      })
      .catch(function(err) {});
    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance;
    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
        simpleStorage
        .at(ropstenAddress)
        .then(instance => {
          simpleStorageInstance = instance;
          this.setState({ coinbase: accounts[0] });
          // Stores a given value, 5 by default.
          return simpleStorageInstance.balanceOf(accounts[0]);
        })    
        .then(result => {
          console.log(result);
          //this.setState({wrappedEth: this.state.web3.utils.fromWei(result.toString(), "ether" )})
          return simpleStorageInstance.totalSupply().then(result => {
            console.log("SUPPLY", simpleStorageInstance);
            console.log((result / Math.pow(10, 18)).toString(10));
            this.setState({
              totalSupply: (result / Math.pow(10, 18)).toString(10)
            });
            return simpleStorageInstance.govTax().then(result => {
              console.log("GOV TAX", result.toString(10));
              this.setState({ govTax: result.toString(10) });
              return simpleStorageInstance.tadTax().then(result => {
                console.log("TAD TAX",result.toString(10));
                this.setState({ tadTax: result.toString(10) });
                return simpleStorageInstance.govFunds().then(result => {
                  console.log("GOV FUNDS", result.toString(10));
                  this.setState({ govFunds: result.toString(10) });
                  var arr = [];
                  console.log(" account ", accounts.length);
                  for (let x = 0; x < 50; x++) {
                    simpleStorageInstance.governors(x).then(result => {
                      console.log(result);
                      arr.push({ id: x, name: result, state: states[x] });
                      if (x === 49) this.setState({ governors: arr });
                    });
                  }
                });
              });
            });
          });
        });
    });
  }

  changeGovTax() {
    const contract = require("truffle-contract");
    const simpleStorage = contract(SimpleStorageContract);
    simpleStorage.setProvider(this.state.web3.currentProvider);

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance;
    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage
        .at(ropstenAddress)
        .then(instance => {
          simpleStorageInstance = instance;
          this.setState({ coinbase: accounts[0] });
          simpleStorage.defaults({ from: accounts[0] });
          // Stores a given value, 5 by default.
          return simpleStorageInstance.balanceOf(accounts[0]);
        })
        .then(result => {
          console.log(result);
          //this.setState({wrappedEth: this.state.web3.utils.fromWei(result.toString(), "ether" )})
          return simpleStorageInstance
            .setGovTax(this.state.govTaxAmount)
            .then(result => {
              return simpleStorageInstance.govTax().then(result => {
                console.log("GOV TAX");
                console.log(result);
                this.setState({ govTax: result.toString(10) });
                this.handleCloseModal();
              });
            });
        });
    });
  }

  changeTadTax() {
    const contract = require("truffle-contract");
    const simpleStorage = contract(SimpleStorageContract);
    simpleStorage.setProvider(this.state.web3.currentProvider);

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance;
    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage
        .at(ropstenAddress)
        .then(instance => {
          simpleStorageInstance = instance;
          this.setState({ coinbase: accounts[0] });
          simpleStorage.defaults({ from: accounts[0] });
          // Stores a given value, 5 by default.
          return simpleStorageInstance.balanceOf(accounts[0]);
        })
        .then(result => {
          console.log(result);
          //this.setState({wrappedEth: this.state.web3.utils.fromWei(result.toString(), "ether" )})
          return simpleStorageInstance
            .setGameTax(this.state.tadTaxAmount)
            .then(result => {
              return simpleStorageInstance.tadTax().then(result => {
                console.log("GOV TAX");
                console.log(result);
                this.setState({ govTax: result.toString(10) });
                this.handletadCloseModal();
              });
            });
        });
    });
  }

  addSupply() {
    const contract = require("truffle-contract");
    const simpleStorage = contract(SimpleStorageContract);
    simpleStorage.setProvider(this.state.web3.currentProvider);

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance;
    // Get accounts.
    var that = this;
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage
        .at(ropstenAddress)
        .then(instance => {
          simpleStorageInstance = instance;
          this.setState({ coinbase: accounts[0] });
          console.log(accounts[0]);
          simpleStorage.defaults({ from: accounts[0] });
          // Stores a given value, 5 by default.
          return simpleStorageInstance.balanceOf(accounts[0]);
        })
        .then(result => {
          console.log(result);
          //this.setState({wrappedEth: this.state.web3.utils.fromWei(result.toString(), "ether" )})
          simpleStorageInstance
            .mint(that.state.addAmount * Math.pow(10, 18))
            .then(result => {
              console.log("WORKED");
              return simpleStorageInstance.totalSupply().then(result => {
                this.setState({
                  totalSupply: (result / Math.pow(10, 18)).toString(10)
                });
              });
            });
        });
    });
  }

  wrapEth() {
    const contract = require("truffle-contract");
    const simpleStorage = contract(SimpleStorageContract);
    simpleStorage.setProvider(this.state.web3.currentProvider);

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance;

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage.defaults({ from: accounts[0] });
      simpleStorage
        .at(address)
        .then(instance => {
          simpleStorageInstance = instance;
          console.log(accounts[0]);
          console.log(accounts[0]);
          return simpleStorageInstance.deposit({
            value: this.state.web3.toWei(
              this.state.convertAmount.toString(),
              "ether"
            )
          });
        })
        .then(result => {
          return simpleStorageInstance.balanceOf(accounts[0]);
        })
        .then(result => {
          this.setState({
            wrappedEth: this.state.web3.fromWei(
              result.toString(),
              "ether"
            )
          });
          return simpleStorageInstance.get.call(accounts[0]);
        });
    });
  }

  withdrawEth() {
    const contract = require("truffle-contract");
    const simpleStorage = contract(SimpleStorageContract);
    simpleStorage.setProvider(this.state.web3.currentProvider);

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance;

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage.defaults({ from: accounts[0] });
      simpleStorage
        .at(address)
        .then(instance => {
          simpleStorageInstance = instance;
          console.log(accounts[0]);
          console.log(
            this.state.web3.toWei(
              this.state.convertAmount.toString(),
              "ether"
            )
          );
          return simpleStorageInstance.withdraw(
            this.state.web3.toWei(
              this.state.convertAmount.toString(),
              "ether"
            )
          );
        })
        .then(result => {
          // Update state with the result.

          return simpleStorageInstance.balanceOf(accounts[0]);
        })
        .then(result => {
          this.setState({
            wrappedEth: this.state.web3.fromWei(
              this.state.convertAmount.toString(),
              "ether"
            )
          });
        });
    });

    //console.log(result)
    //return this.setState({ wrappedEth: result.c[0] })
  }

  changeGovernor(val) {
    const contract = require("truffle-contract");
    
    const simpleStorage = contract(SimpleStorageContract);
    simpleStorage.setProvider(this.state.web3.currentProvider);

    // // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance;
    // Get accounts.

    // var isAddress = this.state.web3.isAddress(ropstenAddress);
    // console.log("isAddress",isAddress); // true

    this.state.web3.eth.getAccounts((error, accounts) => {
      
      simpleStorage
        .at(ropstenAddress)
        .then(instance => {
          simpleStorageInstance = instance;
          this.setState({ coinbase: accounts[0] });
          console.log(accounts[0]);
          simpleStorage.defaults({ from: accounts[0] });
          // Stores a given value, 5 by default.
          return simpleStorageInstance.setGovernor(
            this.state.govNumber,
            this.state.govName
          );
        })
        .then(result => {
          var arr = this.state.governors;
          arr[val].name = this.state.govName;
          this.setState({ governors: arr });
          this.handleCloseGovModal();
        });
    });
  }

  changeCurrency() {
    fetch(backend_endPoint + "test2/", {
      method: "post",
      //mode: 'no-cors',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        currency: this.state.curCurrency,
        price: this.state.currencyVal
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log("data" + data);
        this.setState({ exchangeValues: data });
      })
      .catch(function(err) {});
    this.handleCurrencyCloseModal();
  }

  buttonFormatter(cell, row) {
    console.log("cell", cell)
    console.log("row", row)
    return (
      <button onClick={() => this.handleGovOpenModal(row.id)}>EDIT</button>
    );
  }

  ticketFormatter(cell, row) {
    return (
      <div>
        {cell[0]} {cell[1]} {cell[2]} {cell[3]} {cell[4]} {cell[5]}
      </div>
    );
  }

  buttonCurrencyFormatter(cell, row) {
    return (
      <button onClick={() => this.handleCurrencyOpenModal(row.currency)}>
        EDIT
      </button>
    );
  }

  switchPanel(val) {
    this.setState({ panel: val });
  }

  calcPayout(winningNumbers) {
    var three = [];
    var four = [];
    var five = [];
    var six = [];
    var payout = 0;
    
    this.state.ticketList.forEach(function(e) {
      var count = 0;
      for (var x = 0; x < 6; x++) {
        if (e.numbers[x] === winningNumbers[x]) {
          count++;
        }
      }
      if (count === 3) three.push(e.user);
      else if (count === 4) four.push(e.user);
      else if (count === 5) five.push(e.user);
      else if (count === 6) six.push(e.user);
    });
    payout += this.state.jackpot * 0.1 * three.length;
    payout += this.state.jackpot * 0.2 * four.length;
    payout += this.state.jackpot * 0.3 * five.length;
    payout += this.state.jackpot * six.length;
    return payout;
  }

  randomizeWinner() {
    var arr = [0, 0, 0, 0, 0, 0];
    for (var x = 0; x < 6; x++) {
      arr[x] = (Math.random() * 50).toFixed(0);
    }
    console.log("RANDOM");
    this.setState({ winningNumbers: arr });
  }

  winningNumberUp(val) {
    var arr = this.state.winningNumbers;
    arr[val] = (arr[val] + 1) % 51;
    this.setState({ winningNumbers: arr });
  }

  winningNumberDown(val) {
    var arr = this.state.winningNumbers;
    if (arr[val] > 0) arr[val] = (arr[val] - 1) % 51;
    else {
      arr[val] = 50;
    }
    this.setState({ winningNumbers: arr });
  }

  render() {
    console.log(" gover => ", this.state.governors);
    //https://discordapp.com/api/guilds/457238173060169728/widget.json
    const panels = [
      <main
        style={{
          backgroundColor: "#2c2c2c",
          backgroundImage: `url("${frontend_endPoint}usFlag.jpg")`,
          backgroundSize: "cover",
          height: "100vh",
          margin: 0,
          paddingTop: "10px"
        }}
        className="container"
      >
        <h2
          style={{
            position: "absolute",
            right: "0px",
            top: "0px",
            padding: "5px"
          }}
          onClick={() => this.switchPanel(1)}
        >
          LOTTERY
        </h2>
        <h2
          style={{
            position: "absolute",
            right: "200px",
            top: "0px",
            padding: "5px"
          }}
          onClick={() => this.switchPanel(2)}
        >
          AUCTION
        </h2>
        <h1>THE AMERICAN DREAM</h1>
        <div
          style={{
            display: "flex",
            position: "relative",
            height: "calc(100% - 30px)"
          }}
        >
          <div style={{ width: "40%" }}>
            <div className="box" style={{ height: "62%", overflow: "scroll" }}>
              <h2>GOVENORS</h2>
              <BootstrapTable
                data={this.state.governors}
                height="200px"
                scrollTop={"Top"}
                dataAlign="center"
                striped
                hover
              >
                <TableHeaderColumn
                  dataAlign="center"
                  isKey
                  width={"25px"}
                  dataField="state"
                >
                  STATE
                </TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" dataField="name">
                  Name
                </TableHeaderColumn>
                {/* <TableHeaderColumn
                  dataAlign="center"
                  width={"20px"}
                  dataField="p"
                /> */}
                <TableHeaderColumn
                  dataAlign="center"
                  dataFormat={this.buttonFormatter}
                  width={"20px"}
                  dataField="id"
                />                
              </BootstrapTable>
            </div>

            <div className="box">
              <h2>TAXATION</h2>
              <div
                style={{
                  display: "flex",
                  borderBottom: "2px solid #4c4c4c",
                  padding: "0 5px"
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3>TAD</h3>
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <h3>{this.state.tadTax}%</h3>
                </div>
                <div style={{ flex: 1, textAlign: "center", margin: "auto" }}>
                  <button onClick={this.handleTadOpenModal}>EDIT</button>
                </div>
              </div>
              <div style={{ display: "flex", padding: "0 5px" }}>
                <div style={{ flex: 1 }}>
                  <h3>GOV</h3>
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <h3>{this.state.govTax}%</h3>
                </div>
                <div style={{ flex: 1, textAlign: "center", margin: "auto" }}>
                  <button onClick={this.handleOpenModal}>EDIT</button>
                </div>
              </div>
            </div>
          </div>

          <div style={{ width: "40%" }}>
            <div className="box" style={{ textAlign: "center" }}>
              <h2>DD IN CIRCULATION</h2>
              <h3>
                {parseInt(this.state.totalSupply, 10)
                  .toFixed(0)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                DD
              </h3>
              <h3>
                $
                {(parseInt(this.state.totalSupply, 10) * 5)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </h3>
            </div>

            <div className="box">
              <h2>CREATE DD</h2>
              <div style={{ padding: "5px", textAlign: "center" }}>
                <input
                  onChange={this.handleChange}
                  value={this.state.addAmount}
                  style={{
                    backgroundColor: "grey",
                    border: "none",
                    borderRadius: "4px"
                  }}
                />
                <br />
                <br /> <button onClick={this.addSupply}>ADD</button>
              </div>
            </div>
            <div style={{ overflow: "scroll", height: "40%" }} className="box">
              <h2>$ VALUES</h2>
              <BootstrapTable
                data={this.state.exchangeValues}
                height="200"
                scrollTop={"Top"}
                dataAlign="center"
                striped
                hover
              >
                <TableHeaderColumn
                  dataAlign="center"
                  isKey
                  dataField="currency"
                >
                  Currency
                </TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" dataField="price">
                  Price
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataAlign="center"
                  dataFormat={this.buttonCurrencyFormatter}
                  dataField="id"
                >
                  Price
                </TableHeaderColumn>
              </BootstrapTable>
            </div>
          </div>
        </div>
      </main>,

      <main
        style={{
          backgroundColor: "#2c2c2c",
          backgroundImage: `'url("${frontend_endPoint}usFlag.jpg")'`,
          backgroundSize: "cover",
          height: "100vh",
          margin: 0,
          paddingTop: "10px"
        }}
        className="container"
      >
        <h2
          style={{
            position: "absolute",
            right: "0px",
            top: "0px",
            padding: "5px"
          }}
          onClick={() => this.switchPanel(0)}
        >
          GOVERNANCE
        </h2>
        <h2
          style={{
            position: "absolute",
            right: "200px",
            top: "0px",
            padding: "5px"
          }}
          onClick={() => this.switchPanel(2)}
        >
          AUCTION
        </h2>
        <h1>THE AMERICAN DREAM</h1>
        <div
          style={{
            display: "flex",
            position: "relative",
            height: "calc(100% - 30px)"
          }}
        >
          <div style={{ flex: 1 }}>
            <div className="box" style={{ height: "57%", overflow: "scroll" }}>
              <h2>ENTRIES</h2>
              <BootstrapTable
                data={this.state.ticketList}
                height="200px"
                scrollTop={"Top"}
                dataAlign="center"
                striped
                hover
              >
                <TableHeaderColumn
                  dataAlign="center"
                  isKey
                  width={"25px"}
                  dataField="id"
                >
                  ID
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataAlign="center"
                  width={"15px"}
                  dataField="user"
                >
                  Name
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataAlign="center"
                  dataFormat={this.ticketFormatter}
                  dataField="numbers"
                />
              </BootstrapTable>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div className="box" style={{ textAlign: "center" }}>
              <h2>SET WINNING NUMBERS</h2>
              <div style={{ display: "inline-block", padding: "5px" }}>
                <p
                  onClick={() => this.winningNumberUp(0)}
                  style={{ cursor: "pointer", color: "white" }}
                >
                  &#9650;
                </p>
                <div className="lotto">{this.state.winningNumbers[0]}</div>
                <p
                  onClick={() => this.winningNumberDown(0)}
                  style={{ cursor: "pointer", color: "white" }}
                >
                  &#9660;
                </p>
              </div>
              <div style={{ display: "inline-block", padding: "5px" }}>
                <p
                  onClick={() => this.winningNumberUp(1)}
                  style={{ cursor: "pointer", color: "white" }}
                >
                  &#9650;
                </p>
                <div className="lotto">{this.state.winningNumbers[1]}</div>
                <p
                  onClick={() => this.winningNumberDown(1)}
                  style={{ cursor: "pointer", color: "white" }}
                >
                  &#9660;
                </p>
              </div>
              <div style={{ display: "inline-block", padding: "5px" }}>
                <p
                  onClick={() => this.winningNumberUp(2)}
                  style={{ cursor: "pointer", color: "white" }}
                >
                  &#9650;
                </p>
                <div className="lotto">{this.state.winningNumbers[2]}</div>
                <p
                  onClick={() => this.winningNumberDown(2)}
                  style={{ cursor: "pointer", color: "white" }}
                >
                  &#9660;
                </p>
              </div>
              <div style={{ display: "inline-block", padding: "5px" }}>
                <p
                  onClick={() => this.winningNumberUp(3)}
                  style={{ cursor: "pointer", color: "white" }}
                >
                  &#9650;
                </p>
                <div className="lotto">{this.state.winningNumbers[3]}</div>
                <p
                  onClick={() => this.winningNumberDown(3)}
                  style={{ cursor: "pointer", color: "white" }}
                >
                  &#9660;
                </p>
              </div>
              <div style={{ display: "inline-block", padding: "5px" }}>
                <p
                  onClick={() => this.winningNumberUp(4)}
                  style={{ cursor: "pointer", color: "white" }}
                >
                  &#9650;
                </p>
                <div className="lotto">{this.state.winningNumbers[4]}</div>
                <p
                  onClick={() => this.winningNumberDown(4)}
                  style={{ cursor: "pointer", color: "white" }}
                >
                  &#9660;
                </p>
              </div>
              <div style={{ display: "inline-block", padding: "5px" }}>
                <p
                  onClick={() => this.winningNumberUp(5)}
                  style={{ cursor: "pointer", color: "white" }}
                >
                  &#9650;
                </p>
                <div className="lotto">{this.state.winningNumbers[5]}</div>
                <p
                  onClick={() => this.winningNumberDown(5)}
                  style={{ cursor: "pointer", color: "white" }}
                >
                  &#9660;
                </p>
              </div>
              <br />
              <button onClick={this.setNumbers}>SET</button>
              <button onClick={this.randomizeWinner}>RANDOMIZE</button>
            </div>

            <div className="box">
              <h2>PROJECTED PAYOUT</h2>
              <div style={{ padding: "5px", textAlign: "center" }}>
                <h2>{this.calcPayout(this.state.winningNumbers)} DD</h2>
              </div>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ height: "40%" }} className="box">
              <h2>CURRENT JACKPOT</h2>
              <h1 style={{ textAlign: "center" }}>
                $
                {this.state.jackpot
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </h1>
            </div>
          </div>
        </div>
      </main>,

      <main
        style={{
          backgroundColor: "#2c2c2c",
          backgroundImage: `'url("${frontend_endPoint}usFlag.jpg")'`,
          backgroundSize: "cover",
          height: "100vh",
          margin: 0,
          paddingTop: "10px"
        }}
        className="container"
      >
        <h2
          style={{
            position: "absolute",
            right: "0px",
            top: "0px",
            padding: "5px"
          }}
          onClick={() => this.switchPanel(0)}
        >
          GOVERNANCE
        </h2>
        <h2
          style={{
            position: "absolute",
            right: "200px",
            top: "0px",
            padding: "5px"
          }}
          onClick={() => this.switchPanel(1)}
        >
          LOTTERY
        </h2>
        <h1>THE AMERICAN DREAM</h1>
        <div
          style={{
            display: "flex",
            position: "relative",
            height: "calc(100% - 30px)"
          }}
        >
          <div style={{ flex: 1 }}>
            <div className="box" style={{ height: "57%", overflow: "scroll" }}>
              <h2>ITEMS</h2>
              <BootstrapTable
                data={this.state.itemList}
                height="200px"
                scrollTop={"Top"}
                dataAlign="center"
                striped
                hover
              >
                <TableHeaderColumn
                  dataAlign="center"
                  isKey
                  width={"25px"}
                  dataField="name"
                >
                  Name
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataAlign="center"
                  width={"15px"}
                  dataField="category"
                >
                  Category
                </TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" dataField="price" />
              </BootstrapTable>
            </div>

            <div className="box" style={{ height: "33%", overflow: "scroll" }}>
              <h2>CREATE ITEM</h2>
              <div style={{ display: "flex" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "white" }}>Name:</p>
                  <input
                    value={this.state.itemName}
                    onChange={this.handleNameChange}
                  />
                  <p style={{ color: "white" }}>Price:</p>
                  <input
                    value={this.state.itemPrice}
                    onChange={this.handlePriceChange}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "white" }}>Category:</p>
                  <input
                    value={this.state.itemCategory}
                    onChange={this.handleCategoryChange}
                  />
                  <br />
                  <button onClick={this.createItem}>Create</button>
                </div>
              </div>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ height: "50%" }} className="box">
              <h2>AUCTIONS</h2>
              <BootstrapTable
                data={this.state.auctionList}
                height="200px"
                scrollTop={"Top"}
                dataAlign="center"
                striped
                hover
              >
                <TableHeaderColumn
                  dataAlign="center"
                  isKey
                  width={"25px"}
                  dataField="id"
                >
                  ID
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataAlign="center"
                  width={"15px"}
                  dataField="user"
                >
                  Name
                </TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" dataField="price" />
              </BootstrapTable>
            </div>
          </div>
        </div>
      </main>
    ];
    return (
      <div className="App">
        {/*<nav className="navbar pure-menu pure-menu-horizontal">
                          <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
                        </nav>*/}
        <MediaQuery query="(min-device-width: 900px)">
          {panels[this.state.panel]}

          <ReactModal
            isOpen={this.state.showtadModal}
            onRequestClose={this.handletadCloseModal}
            contentLabel="Controls"
            style={{
              overlay: {
                backgroundColor: "rgba(0,0,0,0.2)"
              },
              content: {
                color: "white",
                backgroundColor: "rgba(0,0,0,0.8)",
                margin: "15% calc(15% - 60px)",
                width: "70%",
                height: "45%",
                border: "none",
                borderRadius: "5px",
                textAlign: "center"
              }
            }}
          >
            <h2>Set TAD TAX</h2>
            <input
              onChange={this.handleTadChange}
              value={this.state.tadTaxAmount}
              style={{
                backgroundColor: "grey",
                border: "none",
                borderRadius: "4px"
              }}
            />
            <br />
            <button onClick={this.changeTadTax.bind(this)}>SET</button>
          </ReactModal>

          <ReactModal
            isOpen={this.state.showModal}
            onRequestClose={this.handleCloseModal}
            contentLabel="Controls"
            style={{
              overlay: {
                backgroundColor: "rgba(0,0,0,0.2)"
              },
              content: {
                color: "white",
                backgroundColor: "rgba(0,0,0,0.8)",
                margin: "15% calc(15% - 60px)",
                width: "70%",
                height: "45%",
                border: "none",
                borderRadius: "5px",
                textAlign: "center"
              }
            }}
          >
            <h2>Set GOV TAX</h2>
            <input
              onChange={this.handleGovChange}
              value={this.state.govTaxAmount}
              style={{
                backgroundColor: "grey",
                border: "none",
                borderRadius: "4px"
              }}
            />
            <br />
            <button onClick={this.changeGovTax.bind(this)}>SET</button>
          </ReactModal>

          <ReactModal
            isOpen={this.state.showGovModal}
            onRequestClose={this.handleGovCloseModal}
            contentLabel="Controls"
            style={{
              overlay: {
                backgroundColor: "rgba(0,0,0,0.2)"
              },
              content: {
                color: "white",
                backgroundColor: "rgba(0,0,0,0.8)",
                margin: "15% calc(15% - 60px)",
                width: "70%",
                height: "45%",
                border: "none",
                borderRadius: "5px",
                textAlign: "center"
              }
            }}
          >
            <h2>Set GOVERNOR</h2>
            <input
              onChange={this.handleGovNameChange}
              value={this.state.govName}
              style={{
                backgroundColor: "grey",
                border: "none",
                borderRadius: "4px"
              }}
            />
            <br />
            <button onClick={this.changeGovernor.bind(this)}>SET</button>
          </ReactModal>

          <ReactModal
            isOpen={this.state.showCurrencyModal}
            onRequestClose={this.handleCurrencyCloseModal}
            contentLabel="Controls"
            style={{
              overlay: {
                backgroundColor: "rgba(0,0,0,0.2)"
              },
              content: {
                color: "white",
                backgroundColor: "rgba(0,0,0,0.8)",
                margin: "15% calc(15% - 60px)",
                width: "70%",
                height: "45%",
                border: "none",
                borderRadius: "5px",
                textAlign: "center"
              }
            }}
          >
            <h2>SET CURRENCY</h2>
            <input
              onChange={this.handleCurrencyChange}
              value={this.state.currencyVal}
              style={{
                backgroundColor: "grey",
                border: "none",
                borderRadius: "4px"
              }}
            />
            <br />
            <button onClick={this.changeCurrency.bind(this)}>SET</button>
          </ReactModal>
        </MediaQuery>
      </div>
    );
  }
}

//export default App
export default withAlert(App);
