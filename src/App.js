import React, { Component } from "react";
import getWeb3 from "./utils/getWeb3";
import "rc-slider/assets/index.css";
// import Ping from "ping.js";
import MediaQuery from "react-responsive";
import ping from "web-pingjs";
import { withAlert } from "react-alert";
import ReactModal from "react-modal";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import $ from "jquery";
import Textarea from 'react-textarea-autosize';

import "./css/oswald.css";
import "./css/open-sans.css";
import "./css/pure-min.css";
import "./App.css";
import {ApiProvider} from './ApiProvider.js'
// import { states } from "./constant";
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';

library.add(faEdit, faSave, faTrash)

var ReactBsTable = require("react-bootstrap-table");
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;

const address = "0x9dda40dabd849bbb087dcbcf0c5223ec5ffa0ad7";
//local
// const ropstenAddress = "0x925b54aDD77B84926FB3EE334763946BccD2909a";
const ropstenAddress = "0xc5d06f81800481828B6951Ae5957Bc69ed61301f";
const frontend_endPoint = "http://localhost:3000/";
const backend_endPoint = "http://localhost:5001/";

const SimpleStorageContract = require("../build/contracts/DD.json");

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
        { currency: "USD", price: 5 }
        // { currency: "GBP", price: 5 },
        // { currency: "VND", price: 5 },
        // { currency: "AUD", price: 5 }
      ],
      ledger: [{ user: "player1", buy: "item", price: 55 }],
      web3: null,
      europePing: 0,
      asiaPing: 0,
      usPing: 0,
      jackpot: 0,
      jackpotId: "",
      jackpotDD: 0,
      coinbase: "",
      regionSelected: 0,
      transactionStage: 3,
      wrappedEth: "0",
      itemList: [],
      auctionList: [],
      ticketList: [],
      winningNumbers: [5, 2, 3, 24, 3, 3],
      convertAmount: 0,
      curCurrency: "",
      wrapReq: 0.005,
      showModal: false,
      showtadModal: false,
      showGovModal: false,
      userCode: "",
      govId: 0,
      currencyVal: 0,
      showCurrencyModal: false,
      showInfoModal: false,
      refLink: null,
      network: 0,
      widgetOpen: true,
      profileOpen: false,
      isEditJackPot: false,

      DPRmsg: '',
      IAMHIMmsg: '',
      PRESIDENTmsg: '',
    };
    // this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    // this.handleTadOpenModal = this.handleTadOpenModal.bind(this);
    this.handleTadCloseModal = this.handleTadCloseModal.bind(this);
    this.handleGovOpenModal = this.handleGovOpenModal.bind(this);
    this.handleGovCloseModal = this.handleGovCloseModal.bind(this);
    this.handleCurrencyOpenModal = this.handleCurrencyOpenModal.bind(this);
    this.handleCurrencyCloseModal = this.handleCurrencyCloseModal.bind(this);
    this.handleInfoOpenModal = this.handleInfoOpenModal.bind(this);
    // this.handleChange = this.handleChange.bind(this);
    // this.addSupply = this.addSupply.bind(this);
    this.buttonFormatter = this.buttonFormatter.bind(this);
    this.buttonCurrencyFormatter = this.buttonCurrencyFormatter.bind(this);
    this.handleGovNameChange = this.handleGovNameChange.bind(this);
    this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
    // this.switchPanel = this.switchPanel.bind(this);
    // this.winningNumberUp = this.winningNumberUp.bind(this);
    // this.winningNumberDown = this.winningNumberDown.bind(this);
    this.calcPayout = this.calcPayout.bind(this);
    // this.randomizeWinner = this.randomizeWinner.bind(this);
    // this.setNumbers = this.setNumbers.bind(this);
    this.createItem = this.createItem.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleGovChange = this.handleGovChange.bind(this);
    this.onChangeJackpot = this.onChangeJackpot.bind(this);
    this.entriesAction = this.entriesAction.bind(this);
    this.handleDeleteEntries = this.handleDeleteEntries.bind(this);
    // this.deleteAllItems = this.deleteAllItems.bind(this);
  }

  handleOpenModal = ()=> this.setState({ showModal: true });

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  handleTadOpenModal = () => this.setState({ showtadModal: true });

  handleTadCloseModal() {
    this.setState({ showtadModal: false });
  }

  handleGovOpenModal(val) {
    this.setState({ showGovModal: true, govId: val });
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

  handleChange = (event)=> this.setState({ addAmount: event.target.value });

  handleGovChange(event) {
    this.setState({ govTaxAmount: event.target.value });
  }

  handleTadChange = event => {
    this.setState({ tadTaxAmount: event.target.value });
  };
  
  handleGovNameChange(event) {
    this.setState({ userCode: event.target.value });
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

  handletadCloseModal = () => this.setState({ showtadModal: false });

  onChangeJackpot(event) {
    this.setState({ jackpot: event.target.value });
  }
  
  saveJackPot = () =>{
    this.setState({isEditJackPot: false})
    fetch(backend_endPoint + "setJackpot/", {
      method: "post",
      //mode: 'no-cors',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: this.state.jackpotId,
        value: this.state.jackpot,
      })
    })
    .then(response => response.json())
    .then(data => {
      if(data){
        this.setState({isEditJackPot: false})
      }
      else{
        alert("Server Database Error");
      }
    })
    .catch(function(err) {
      console.log("create item err " , err);
    });
  }

  editJackPot = () =>{
    this.jackpotInput.focus();
    this.setState({isEditJackPot: true})
  }
  
  handleDeleteEntries(name) {
    confirmAlert({
      title: '',
      message: 'Are you sure you want to delete this item?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            fetch(backend_endPoint + "deleteItem/", {
              method: "post",
              //mode: 'no-cors',
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                name: name
              })
            })
            .then(response => response.json())
            .then(itemList => {
              this.setState({ itemList });        
            })
            .catch(function(err) {
              console.log("create item err " , err);
            });
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    })
  }

  deleteAllItems = ()=> {
    confirmAlert({
      title: '',
      message: 'Are you sure you want to delete all items?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            fetch(backend_endPoint + "deleteAllItem/", {
              method: "post",
              //mode: 'no-cors',
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              }
            })
            .then(response => response.json())
            .then(itemList => {
              this.setState({ itemList });        
            })
            .catch(function(err) {
              console.log("create item err " , err);
            });
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    })
  }

  async componentDidMount() {
    ReactModal.setAppElement("body");
    try {
      var winningNumbers = await ApiProvider(backend_endPoint + "getNumbers/", "POST", {
        currency: this.state.curCurrency,
        price: this.state.currencyVal
      });

      console.log("winningNumbers", winningNumbers);
      var itemList = await ApiProvider(backend_endPoint + "getItems/", "GET",null);
      console.log("itemList", itemList);
      
      var jackpot = await ApiProvider(backend_endPoint + "getJackpot/", "GET",null);
      console.log("jackpot", jackpot);

      this.setState({ winningNumbers, itemList, jackpot: jackpot[0].value, jackpotId:jackpot[0]._id });

      var governors = await ApiProvider(backend_endPoint + "api/governor/all/", "GET",null);
      console.log("governors", governors);
      if(governors.status == 200){
        this.setState({governors: governors.payload});   
      }
      else{
        alert(governors.message);
      }

      var auctionList = await ApiProvider(backend_endPoint + "api/auction/result/", "GET",null);
      if(auctionList.status == 200){
        this.setState({auctionList: auctionList.payload})
      }
      else{
        alert(auctionList.message);        
      }

      var ticketList = await ApiProvider(backend_endPoint + "getTickets/", "GET",null);
      if(ticketList.status == 200){
        this.setState({ticketList: ticketList.payload})
      }
      else{
        alert(ticketList.message);        
      }
      
    } catch (error) {
      console.log("error => "+error);
      alert(error);
    }
  }

  async createItem() {
    try {
      var itemList = await ApiProvider(backend_endPoint + "createItem/", "POST", {
        name: this.state.itemName,
        price: this.state.itemPrice,
        category: this.state.itemCategory
      });
      this.setState({ itemList, itemName: '', itemPrice: '', itemCategory: '' });      
    } catch (error) {
      alert(error);
    }
  }

  componentWillMount() {
    getWeb3
      .then(results => {
        this.setState({ web3: results.web3 });
        results.web3.version.getNetwork((err, netId) => {
          if (netId == 3) {
            this.instantiateRopstenContract();
            this.setState({ network: netId });
          } else {
            this.instantiateContract();
            //that.scrapeKyber();
          }
        });
      })
      .catch(e => {
        console.log("Error finding web3." + e);
      });
  }

  setNumbers = async () => {
    try {
      await ApiProvider(backend_endPoint + "setNumbers/", "POST", {
        numbers: this.state.winningNumbers,
        price: this.state.currencyVal
      });      
    } catch (error) {
      alert(error);
    }
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
            wrappedEth: this.state.web3.fromWei(result.toString(), "ether")
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
          return simpleStorageInstance.totalSupply().then(result => {
            console.log("SUPPLY", simpleStorageInstance);
            this.setState({
              totalSupply: (result / Math.pow(10, 18)).toString(10)
            });
            /*
            return simpleStorageInstance.govTax().then(result => {
              console.log("GOV TAX", result.toString(10));
              this.setState({ govTax: result.toString(10) });
              return simpleStorageInstance.tadTax().then(result => {
                console.log("TAD TAX", result.toString(10));
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
            }); */
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
          console.log(result.toString(10));
          return simpleStorageInstance
            .setGovTax(this.state.govTaxAmount)
            .then(result => {
              console.log(" 460 set Gov Tax result ", result);
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
    var simpleStorageInstance;
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage
        .at(ropstenAddress)
        .then(instance => {
          simpleStorageInstance = instance;
          this.setState({ coinbase: accounts[0] });
          simpleStorage.defaults({ from: accounts[0] });
          return simpleStorageInstance.balanceOf(accounts[0]);
        })
        .then(result => {
          return simpleStorageInstance
            .setGameTax(this.state.tadTaxAmount)
            .then(result => {
              return simpleStorageInstance.tadTax().then(result => {
                this.setState({ tadTax: result.toString(10) });
                this.handletadCloseModal();
              });
            });
        });
    });
  }

  addSupply = () => {
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
              var temp = parseInt(this.state.totalSupply) + parseInt(this.state.addAmount);
              this.setState({
                totalSupply: temp.toString(10)
              });
              // return simpleStorageInstance.totalSupply();
            
            // .then(result=>{
            //   console.log("WORKED supply ", result / Math.pow(10, 18));
            //   this.setState({
            //     totalSupply: Math.round(result / Math.pow(10, 18)).toString(10)
            //   },() => { console.log('new state', this.state.totalSupply)});
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
            wrappedEth: this.state.web3.fromWei(result.toString(), "ether")
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
            this.state.web3.toWei(this.state.convertAmount.toString(), "ether")
          );
          return simpleStorageInstance.withdraw(
            this.state.web3.toWei(this.state.convertAmount.toString(), "ether")
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

  async changeGovernor() {
    try {
      var governors = await ApiProvider(backend_endPoint + "api/governor/update/", "POST", {
        id: this.state.govId,
        userCode: this.state.userCode
      });
      this.handleGovCloseModal();
      if(governors.status == 200){
        this.setState({ governors: governors.payload });
      }
      else{
        alert(governors.message)
      }
    } catch (error) {
      this.handleGovCloseModal();
      alert(error);
    }
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
    return (
      <div onClick={()=>this.handleGovOpenModal(row._id)}>
        <FontAwesomeIcon size="lg" color="white" icon="edit" />
      </div>
    );
  }
  
  entriesAction(cell, row) {
    return (
      <div onClick={()=>this.handleDeleteEntries(row.name)}>
        <FontAwesomeIcon size="1x" color="white" icon="trash" />
      </div>
    );
  }

  ticketFormatter(cell, row) {
    return (
      <div>
        {cell[0]}&nbsp;&nbsp;{cell[1]}&nbsp;&nbsp;{cell[2]}&nbsp;&nbsp;{cell[3]}&nbsp;&nbsp;{cell[4]}&nbsp;&nbsp;{cell[5]}
      </div>
    );
  }

  buttonCurrencyFormatter(cell, row) {
    return (
      <div onClick={()=>this.handleCurrencyOpenModal(row.currency)}>
        <FontAwesomeIcon size="lg" color="white" icon="edit" />
      </div>
    );
  }

  switchPanel = (val) => this.setState({ panel: val });

  getMatchingElementCount(left, right) {
    let clonedLeft = []
    left.forEach(element => {
      clonedLeft.push(element)
    })

    let matchedCount = 0
    right.forEach(element => {
      //find matching index
      let matchedIndex = clonedLeft.indexOf(element)

      if (matchedIndex !== -1) {
        clonedLeft.splice(matchedIndex, 1)
        matchedCount++
      }
    })

    return matchedCount
  }

  calcPayout(winningNumbers) {
    // var dd = this.state.exchangeValues;
    // var usdPrice = 0;
    // dd.forEach(item=>{
    //   if(item.currency == "USD")
    //     usdPrice = item.price;
    // })

    var isLevel = 0;
    var payout = 0;
    this.state.ticketList.forEach(ticket => {
      let matchingCount = this.getMatchingElementCount(ticket.numbers, winningNumbers)

      if(matchingCount == 6){
        isLevel = 6;
      }
      else if (matchingCount == 5){
        isLevel = 5;
      }
      else if( matchingCount == 4)
        isLevel = 4;

    });

    if(isLevel == 6){
      payout = parseInt(this.state.jackpot);
    }
    else if (isLevel == 5){
      payout = (parseInt(this.state.jackpot) * 0.1 );
    }
    else if(isLevel == 4){
      payout = (parseInt(this.state.jackpot) * 0.01);
    }

    return payout;
  }

  randomizeWinner = () => {
    var arr = [0, 0, 0, 0, 0, 0];
    for (var x = 0; x < 6; x++) {
      arr[x] = (Math.random() * 50).toFixed(0);
    }
    console.log("RANDOM");
    this.setState({ winningNumbers: arr });
  }

  winningNumberUp = (val)=> {
    var arr = this.state.winningNumbers;
    arr[val] = (parseInt(arr[val], 10) + parseInt(1, 10)) % 51;
    this.setState({ winningNumbers: arr });
  }

  winningNumberDown = (val)=> {
    var arr = this.state.winningNumbers;
    if (arr[val] > 0) arr[val] = (parseInt(arr[val], 10) - parseInt(1, 10)) % 51;
    else {
      arr[val] = 50;
    }
    this.setState({ winningNumbers: arr });
  }

  handleDPRChange =(event)=> this.setState({DPRmsg: event.target.value});
  handleIAMHIMChange =(event)=> this.setState({IAMHIMmsg: event.target.value});
  handlePRESIDENTChange =(event)=> this.setState({PRESIDENTmsg: event.target.value});

  sendMessage = async (value) => {
    var params = {}
    if(value == 1){
      params = {
        message: this.state.DPRmsg,
        sender: value
      }
    }
    else if( value == 2){
      params = {
        message: this.state.IAMHIMmsg,
        sender: value
      }
    }
    else{
      params = {
        message: this.state.PRESIDENTmsg,
        sender: value
      }
    }

    try {
      var result = await ApiProvider(backend_endPoint + "api/message/send", "POST", params);
      if(result.status == 200){
        if(value == 1){
          this.setState({DPRmsg: ''});
        }
        else if( value == 2){
          this.setState({IAMHIMmsg: ''});
        }
        else{
          this.setState({PRESIDENTmsg: ''});
        }
      }
      else{
        alert(result.message)
      }
    } catch (error) {
      console.log({error});
    }
  }

  render() {
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
        <h2 style={{ position: "absolute", right: "0px", top: "0px", padding: "5px" }} onClick={() => this.switchPanel(1)} > LOTTERY </h2>
        <h2 style={{ position: "absolute", right: "200px", top: "0px", padding: "5px" }} onClick={() => this.switchPanel(2)} > AUCTION </h2>
        <h1>THE AMERICAN DREAM</h1>
        <div style={{ display: "flex", position: "relative", height: "calc(100% - 30px)" }} >
          <div style={{ width: "40%" }}>
            <div className="box" style={{ height: "62%", overflow: "scroll" }}>
              <h2>GOVENORS</h2>
              <BootstrapTable data={this.state.governors} height="200px" scrollTop={"Top"} striped={true} hover={true} >
                <TableHeaderColumn dataAlign="center" isKey dataField="state" width="25%"> STATE </TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" dataField="userCode" width="30%"> GAMER CODE </TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" dataField="userName" width="30%"> NAME </TableHeaderColumn>                
                <TableHeaderColumn dataAlign="center" dataFormat={this.buttonFormatter} dataField="_id" width="15%" > ACTION </TableHeaderColumn>
              </BootstrapTable>
            </div>

            <div className="box">
              <h2>TAXATION</h2>
              <div style={{ display: "flex", borderBottom: "2px solid #4c4c4c", padding: "0 5px" }}>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <h3>TAD</h3>
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <h3>{this.state.tadTax}%</h3>
                </div>
                <div style={{ flex: 1, textAlign: "center", margin: "auto" }}>
                  <div onClick={()=>this.handleTadOpenModal()}>
                    <FontAwesomeIcon size="lg" color="white" icon="edit" />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", padding: "0 5px" }}>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <h3>GOV</h3>
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <h3>{this.state.govTax}%</h3>
                </div>
                <div style={{ flex: 1, textAlign: "center", margin: "auto" }}>
                  <div onClick={()=>this.handleOpenModal()}>
                    <FontAwesomeIcon size="lg" color="white" icon="edit" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ width: "30%" }}>
            <div className="box" style={{ textAlign: "center" }}>
              <h2>DD IN CIRCULATION</h2>
              <h3> { parseInt(this.state.totalSupply, 10).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                <span style={{color:"#d8d51a"}}>&nbsp;&nbsp;DD</span>
              </h3>
              <h3>
                <span style={{color:"#d8d51a"}}>$&nbsp;&nbsp;</span>
                {(parseInt(this.state.totalSupply, 10) * parseInt(this.state.exchangeValues[0].price, 10)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </h3>
            </div>

            <div className="box">
              <h2>CREATE DD</h2>
              <div style={{ padding: "5px", textAlign: "center" }}>
                <input onChange={(e)=>this.handleChange(e)} value={this.state.addAmount} style={{ backgroundColor: "grey", border: "none", borderRadius: "4px" }} />
                <br />
                <br /> <button onClick={()=>this.addSupply()}>ADD</button>
              </div>
            </div>
            <div style={{ overflow: "scroll", height: "40%" }} className="box">
              <h2>$ VALUES</h2>
              <BootstrapTable data={this.state.exchangeValues} height="200" scrollTop={"Top"} striped hover >
                <TableHeaderColumn dataAlign="center" isKey dataField="currency" width="30%" > CURRENCY </TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" dataField="price" width="40%"> PRICE </TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" dataFormat={this.buttonCurrencyFormatter} dataField="id" width="30%" > ACTION </TableHeaderColumn>
              </BootstrapTable>
            </div>
          </div>
          <div style={{ width: "40%" }}>
            <div className="box">
              <h2>MESSAGE</h2>
              <div className = "main-container">
                <div className = "row body-red">
                  <div className = "col-md-3"> <span className = "text-white"> DPR </span> </div>
                  <div className="col-md-6">
                    {/* <Textarea minRows={1} maxRows={6} value={this.state.DPRmsg} onChange={(e)=>this.handleDPRChange(e)} className = "text-message-white"/> */}
                    <textarea rows={6} value={this.state.DPRmsg} onChange={(e)=>this.handleDPRChange(e)} className = "text-message-white"/>
                  </div>
                  <div className="col-md-3">
                    <button className = "btn-submit-white" onClick={()=>this.sendMessage(1)}>SUBMIT</button>
                  </div>
                </div>
                <div className = "row body-grey">
                  <div className = "col-md-3"> <span className = "text-white"> IAMHIM </span> </div>
                  <div className="col-md-6">
                    {/* <Textarea minRows={1} maxRows={6} value={this.state.IAMHIMmsg} onChange={(e)=>this.handleIAMHIMChange(e)} className = "text-message-white"/> */}
                    <textarea rows={6} value={this.state.IAMHIMmsg} onChange={(e)=>this.handleIAMHIMChange(e)} className = "text-message-white"/>
                  </div>
                  <div className="col-md-3">
                    <button className = "btn-submit-white" onClick={()=>this.sendMessage(2)}>SUBMIT</button>
                  </div>
                </div>
                <div className = "row body-blue">
                  <div className = "col-md-3"> <span className = "text-white"> PRESIDENT </span> </div>
                  <div className="col-md-6">
                    {/* <Textarea minRows={1} maxRows={6} value={this.state.PRESIDENTmsg} onChange={(e)=>this.handlePRESIDENTChange(e)} className = "text-message-white"/> */}
                    <textarea rows={6} value={this.state.PRESIDENTmsg} onChange={(e)=>this.handlePRESIDENTChange(e)} className = "text-message-white"/>
                  </div>
                  <div className="col-md-3">
                    <button className = "btn-submit-white" onClick={()=>this.sendMessage(0)}>SUBMIT</button>
                  </div>
                </div>
              </div>
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
        <h2 style={{ position: "absolute", right: "0px", top: "0px", padding: "5px" }} onClick={() => this.switchPanel(0)} > GOVERNANCE </h2>
        <h2 style={{ position: "absolute", right: "200px", top: "0px", padding: "5px" }} onClick={() => this.switchPanel(2)} > AUCTION </h2>
        <h1>THE AMERICAN DREAM</h1>
        <div style={{ display: "flex", position: "relative", height: "calc(100% - 30px)" }} >
          <div style={{ width:"50%" }}>
            <div className="box" style={{ height: "57%", overflow: "scroll" }}>
              <h2>ENTRIES</h2>
              <BootstrapTable data={this.state.ticketList} height="200px" scrollTop={"Top"} striped hover >
                <TableHeaderColumn dataAlign="center" width="20%" dataField="name" > NAME </TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" width="40%" dataField="coinbase" isKey > ADDRESS </TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" width="40%" dataFormat={this.ticketFormatter} dataField="numbers" > Numbers </TableHeaderColumn>
                {/* <TableHeaderColumn
                  dataAlign="center"
                  dataFormat={this.buttonFormatter}
                  dataField="id"
                /> */}
              </BootstrapTable>
            </div>
          </div>

          <div style={{ width:"50%" }}>
            <div className="box" style={{ textAlign: "center" }}>
              <h2>SET WINNING NUMBERS</h2>
              <div style={{ padding: 10 }}>
                <div style={{ display: "inline-block", padding: "5px" }}>
                  <p onClick={() => this.winningNumberUp(0)} style={{ cursor: "pointer", color: "white" }} > &#9650; </p>
                  <div className="lotto">{this.state.winningNumbers[0]}</div>
                  <p onClick={() => this.winningNumberDown(0)} style={{ cursor: "pointer", color: "white" }} > &#9660; </p>
                </div>
                <div style={{ display: "inline-block", padding: "5px" }}>
                  <p onClick={() => this.winningNumberUp(1)} style={{ cursor: "pointer", color: "white" }} > &#9650; </p>
                  <div className="lotto">{this.state.winningNumbers[1]}</div>
                  <p onClick={() => this.winningNumberDown(1)} style={{ cursor: "pointer", color: "white" }} > &#9660; </p>
                </div>
                <div style={{ display: "inline-block", padding: "5px" }}>
                  <p onClick={() => this.winningNumberUp(2)} style={{ cursor: "pointer", color: "white" }} > &#9650; </p>
                  <div className="lotto">{this.state.winningNumbers[2]}</div>
                  <p onClick={() => this.winningNumberDown(2)} style={{ cursor: "pointer", color: "white" }} > &#9660; </p>
                </div>
                <div style={{ display: "inline-block", padding: "5px" }}>
                  <p onClick={() => this.winningNumberUp(3)} style={{ cursor: "pointer", color: "white" }} > &#9650; </p>
                  <div className="lotto">{this.state.winningNumbers[3]}</div>
                  <p onClick={() => this.winningNumberDown(3)} style={{ cursor: "pointer", color: "white" }} > &#9660; </p>
                </div>
                <div style={{ display: "inline-block", padding: "5px" }}>
                  <p onClick={() => this.winningNumberUp(4)} style={{ cursor: "pointer", color: "white" }} > &#9650; </p>
                  <div className="lotto">{this.state.winningNumbers[4]}</div>
                  <p onClick={() => this.winningNumberDown(4)} style={{ cursor: "pointer", color: "white" }} > &#9660; </p>
                </div>
                <div style={{ display: "inline-block", padding: "5px" }}>
                  <p onClick={() => this.winningNumberUp(5)} style={{ cursor: "pointer", color: "white" }} > &#9650; </p>
                  <div className="lotto">{this.state.winningNumbers[5]}</div>
                  <p onClick={() => this.winningNumberDown(5)} style={{ cursor: "pointer", color: "white" }} > &#9660; </p>
                </div>
                <br />
                <button onClick={() => this.setNumbers()} style={{marginRight: 10}}>SET</button>
                <button onClick={() => this.randomizeWinner()}>RANDOMIZE</button>
              </div>
            </div>

            <div className="box">
              <h2>PROJECTED PAYOUT</h2>
              <div style={{ padding: "5px", textAlign: "center" }}>
                <h2><span style={{color:"#d8d51a"}}>$&nbsp;&nbsp;</span>{this.calcPayout(this.state.winningNumbers)}</h2>
              </div>
            </div>

            {/* <div style={{ width: "30%" }}> */}
              <div style={{ height: "40%" }} className="box">
                <h2>CURRENT JACKPOT</h2>
                <div style={{
                      marginTop: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                }}>              
                  <span style={{ fontSize: "30px", color: "white", fontWeight: "bold", marginRight: "5px", textAlign: "left" }}>$</span>
                  <input
                      ref={(input) => { this.jackpotInput = input; }} 
                      value={ this.state.isEditJackPot?this.state.jackpot: this.state.jackpot.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}                    
                      onChange={this.onChangeJackpot}
                      style={{ backgroundColor: "transparent", border: "none", fontSize: "30px", color: "white", fontWeight: "bold", marginRight: "20px", width: "70%", textAlign: "left"}}
                      readOnly={this.state.isEditJackPot?false:true }/>
                    
                  <div onClick={()=>{
                    if(this.state.isEditJackPot)
                      return this.saveJackPot();
                    else
                      return this.editJackPot();
                    }}>
                    <FontAwesomeIcon size="lg" color="white" icon={this.state.isEditJackPot?"save":"edit" } />
                  </div>
                </div>              
              </div>
            {/* </div> */}
          </div>          
        </div>
      </main>,

      <main
        style={{ backgroundColor: "#2c2c2c", backgroundImage: `'url("${frontend_endPoint}usFlag.jpg")'`, backgroundSize: "cover", height: "100vh", margin: 0, paddingTop: "10px" }}
        className="container"
      >
        <h2
          style={{ position: "absolute", right: "0px", top: "0px", padding: "5px" }}
          onClick={() => this.switchPanel(0)}>
          GOVERNANCE
        </h2>
        <h2
          style={{ position: "absolute", right: "200px", top: "0px", padding: "5px" }}
          onClick={() => this.switchPanel(1)}
        >
          LOTTERY
        </h2>
        <h1>THE AMERICAN DREAM</h1>
        <div style={{ display: "flex", position: "relative", height: "calc(100% - 30px)" }} >
          <div style={{ width: "45%" }}>
            <div className="box" style={{ height: "57%", overflow: "scroll" }}>
              <div style={{position:"relative"}}>
                <h2>ITEMS</h2>
                <div style={{position:"absolute", right: "22px", top: "12px"}} onClick={()=>this.deleteAllItems()}>
                  <FontAwesomeIcon size="lg" color="white" icon="trash" />
                </div>
              </div>
              <BootstrapTable data={this.state.itemList} height="200px" scrollTop={"Top"} striped hover>
                <TableHeaderColumn dataAlign="center" width="35%" isKey dataField="name"> NAME </TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" width="35%" dataField="price" > PRICE </TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" width="30%" dataFormat={this.entriesAction} dataField="id"> ACTION </TableHeaderColumn>
              </BootstrapTable>
            </div>

            <div className="box" style={{ height: "33%", overflow: "scroll" }}>
              <h2>CREATE ITEM</h2>
              <div style={{ display: "flex", padding: 10 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "white" }}>Name:</p>
                  <input
                    value={this.state.itemName}
                    onChange={this.handleNameChange}
                  />
                  <p style={{ color: "white", marginTop: 20 }}>Price:</p>
                  <input
                    value={this.state.itemPrice}
                    onChange={this.handlePriceChange}
                  />
                </div>
                <div style={{ flex: 1, }}>
                  <p style={{ color: "white" }}>Category:</p>
                  <input
                    value={this.state.itemCategory}
                    onChange={this.handleCategoryChange}
                  />
                  <br />
                  <button style={{ marginTop:"15px"}} onClick={this.createItem}>Create</button>
                </div>
              </div>
            </div>
          </div>

          <div style={{ width: "55%" }}>
            <div style={{ height: "70%" }} className="box">
              <h2>AUCTIONS</h2>
              <BootstrapTable data={this.state.auctionList} height="200px" scrollTop={"Top"} striped hover >
                <TableHeaderColumn dataAlign="center" width="20%" dataField="itemCategory" > ITEM CATEGORY </TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" width="20%" dataField="itemName" > ITEM NAME </TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" width="20%" dataField="biderName" > WINNER NAME </TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" width="20%" dataField="biderGamerCode" isKey> WINNER CODE </TableHeaderColumn>
                <TableHeaderColumn dataAlign="center" width="20%" dataField="bidPrice" > WINNER PRICE </TableHeaderColumn>
              </BootstrapTable>
            </div>
          </div>
        </div>
      </main>
    ];
    return (
      <div className="App">
        <MediaQuery query="(min-device-width: 900px)">
          {panels[this.state.panel]}

          <ReactModal
            isOpen={this.state.showtadModal}
            onRequestClose={this.handletadCloseModal}
            contentLabel="Controls"
            style={{
              overlay: { backgroundColor: "rgba(0,0,0,0.2)"},
              content: { color: "white", backgroundColor: "rgba(0,0,0,0.8)", margin: "15% calc(15% - 60px)", width: "70%", height: "45%", border: "none", borderRadius: "5px", textAlign: "center"}
            }}
          >
            <h2>Set TAD TAX</h2>
            <input
              onChange={this.handleTadChange}
              value={this.state.tadTaxAmount}
              style={{ backgroundColor: "grey", border: "none", borderRadius: "4px", padding: 10 }} />
            <br />
            <button style={{ marginTop: 10 }} onClick={this.changeTadTax.bind(this)}>SET</button>
          </ReactModal>

          <ReactModal
            isOpen={this.state.showModal}
            onRequestClose={this.handleCloseModal}
            contentLabel="Controls"
            style={{
              overlay: { backgroundColor: "rgba(0,0,0,0.2)"},
              content: { color: "white", backgroundColor: "rgba(0,0,0,0.8)", margin: "15% calc(15% - 60px)", width: "70%", height: "45%", border: "none", borderRadius: "5px", textAlign: "center"}
            }}
          >
            <h2>Set GOV TAX</h2>
            <input
              onChange={this.handleGovChange}
              value={this.state.govTaxAmount}
              style={{ backgroundColor: "grey", border: "none", borderRadius: "4px", padding: 10}} />
            <br />
            <button style={{ marginTop: 10 }} onClick={this.changeGovTax.bind(this)}>SET</button>
          </ReactModal>

          <ReactModal
            isOpen={this.state.showGovModal}
            onRequestClose={this.handleGovCloseModal}
            contentLabel="Controls"
            style={{
              overlay: { backgroundColor: "rgba(0,0,0,0.2)"},
              content: { color: "white", backgroundColor: "rgba(0,0,0,0.8)", margin: "15% calc(15% - 60px)", width: "70%", height: "45%", border: "none", borderRadius: "5px", textAlign: "center"}
            }}
          >
            <h2>Set GOVERNOR</h2>
            <input
              onChange={this.handleGovNameChange}
              value={this.state.userCode}
              style={{ backgroundColor: "grey", border: "none", borderRadius: "4px", padding: 10, width:"50%" }} />
            <br />
            <button style={{ marginTop: 10 }} onClick={this.changeGovernor.bind(this)}>SET</button>
          </ReactModal>

          <ReactModal
            isOpen={this.state.showCurrencyModal}
            onRequestClose={this.handleCurrencyCloseModal}
            contentLabel="Controls"
            style={{
              overlay: { backgroundColor: "rgba(0,0,0,0.2)"},
              content: { color: "white", backgroundColor: "rgba(0,0,0,0.8)", margin: "15% calc(15% - 60px)", width: "70%", height: "45%", border: "none", borderRadius: "5px", textAlign: "center"}
            }}
          >
            <h2>SET CURRENCY</h2>
            <input
              onChange={this.handleCurrencyChange}
              value={this.state.currencyVal}
              style={{ backgroundColor: "grey", border: "none", borderRadius: "4px", padding: 10}} />
            <br />
            <button style={{ marginTop: 10 }} onClick={this.changeCurrency.bind(this)}>SET</button>
          </ReactModal>
        </MediaQuery>
      </div>
    );
  }
}

//export default App
export default withAlert(App);
