import React, { useState, useEffect, RadioButton, useRef } from 'react'
import Axios from 'axios';
//import { useHistory } from "react-router-dom";
import EscapeStr from './mysqlConvertChar';
import './Profile.css';
import ReactDOM from "react-dom";
import generatePDF from "./reportGenerator";
import { format } from "date-fns";
import moment from 'moment';
import { SelectSupplierCustomer } from "./selectSupplierCustomer";
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Tooltip as ReactTooltip } from "react-tooltip";
//import Pagination from "./Pagination";
import BootstrapTable from 'react-bootstrap-table-next';
import { SettingsBackupRestoreRounded } from '@material-ui/icons';

import ExportInvoicePdf from './pdfInvoiceGenerator';

//require('dotenv').config();//
const url = process.env.REACT_APP_SERVER_URL;
const companyID = localStorage.getItem('companyID');
const userName = localStorage.getItem('userName');




// const userLevel = localStorage.getItem('userLevel');


var invoiceData = [];

var totalDrAmt = 0;
var totalCrAmt = 0;
var totalTax = 0;
var totalNetAmount = 0;


var taxTotal = 0;
//var invoiceDiscountTotal = 0;
//var invoiceTaxTotal = 0;
var curr = new Date();
var todayDate = curr.toISOString().substr(0, 10);
// format(new Date(date), "dd/MM/yyyy") ;
var supplierID = '';

// alert(format(curr.toISOString().substr(0,10)), "dd/MM/yyyy");
//curr.setDate(curr.getDate());
var dDate= new Date(curr.setDate(curr.getDate()-7));

 var sDate=curr.toISOString().substr(0,10);
//sessionStorage.setItem('voucherNo', '');
//sessionStorage.setItem('invoiceNo','');
//sessionStorage.setItem('invData', []);
 //alert(sDate);
function SalesInvoiceListing() {

  const [data, setData] = useState([]);


  const [companyInfo, setCompanyInfo] = useState([]);
  const [customerInfo, setCustomerInfo] = useState([]);
  const [invoiceData, setInvoiceData] = useState([]);

  const [totalTax, setTotalTax] = useState();
  const [totalNetAmt, setTotalNetAmt] = useState(0);
  // const [supplierID, setSupplierID] = useState('');

  const [txnDate, setTxnDate] = useState(sDate);
  const [dueDate, setDueDate] = useState(todayDate);

  const [invoiceNo, setInvoiceNo] = useState("");

  const [invoiceTotal, setInvoiceTotal] = useState(0);
  const [invoiceDiscountTotal, setInvoiceDiscountTotal] = useState(0);
  const [invoiceTaxTotal, setInvoiceTaxTotal] = useState(0);
  const [invoiceNetTotal, setInvoiceNetTotal] = useState(0);
  const [invoiceTxn, setInvoiceTxn ] = useState([]);

  const mystyle = {
    align: "left",

  };
  // alert(txnDate);
  if (txnDate === null) {
    setTxnDate(todayDate);
  }

  const columns = [

    { dataField: 'id', text: '#', sort: false, headerStyle: { backgroundColor: 'yellow', width: '100px' } },
    { dataField: 'suppCustID', text: 'Customer ID', sort: false, headerStyle: { backgroundColor: '#999999' }, style: { backgroundColor: 'lightgrey', textAlign: 'left' } },
    { dataField: 'suppCustName', text: 'Customer Name', align: 'left', sort: false, headerStyle: { backgroundColor: 'yellow', width: '700px' }, style: { textAlign: 'left' } },
    { dataField: 'txnDate', text: 'Invoice Date', sort: false, headerStyle: { backgroundColor: '#999999' }, style: { backgroundColor: 'lightgrey' } },
    { dataField: 'invoiceNo', text: 'Invoice No', align: 'left', sort: false, headerStyle: { backgroundColor: 'yellow' } },
    { dataField: 'invoiceTotal', text: 'Invoice Total', align: 'right', sort: false, headerStyle: { backgroundColor: '#999999' }, style: { backgroundColor: 'lightgrey' } },

    {
      dataField: "select",
      text: "Select", headerStyle: { backgroundColor: 'blue', color: 'white' },
      formatter: (cellContent: string, row: IMyColumnDefinition) => {

        return <button className="fa fa-check-square" onClick={() => handleSelectInvoice(row.id, row.invoiceNo)}></button>

      },
    }

  ];



  // alert(txnDate);
  const body = {
    companyID: companyID,

  };





  const onInputChange = async (e) => {
    e.preventDefault();
    console.log(e.target.value);

    console.log(e.target.name);
    console.log(e.target.value);

  };


  const buttonStyle = {
    color: "black",
    backgroundColor: "yellow",
    padding: "2px 10px 2px 10px",
    fontFamily: "Arial", todayDate,
  };

  useEffect(() => {



   Axios
     .get(url + `/companyInfo`,
       {
         params: {
           companyID: companyID,

         }
       }
     ).then(res => {

       setCompanyInfo(res.data);

     });


  }, []);












  const formatInputDate = async (e) => {
    e.preventDefault();
    //const cName = e.target.name;
    let dDate = e.target.value;
   // alert(e.target.value);
    setTxnDate(dDate);
    //   alert(dDate);
    // setTxnDate(dDate);
    //    alert(txnDate);
    // onSearchVoucher(setTxnDate(dDate));
  //  inputRef.current.focus();
  };
  const formatInputDueDate = async (e) => {
    e.preventDefault();
    //const cName = e.target.name;
    let dDate = e.target.value;
    // alert(e.target.value);
    setDueDate(dDate);

  };





  const formatInputInvoicetNo = async (e) => {
    e.preventDefault();
    // const cName = e.target.name;
    console.log(e.target.name)
    // e.target.value.replace(/[^a-z0-9\s]/gi, '');
    console.log(e.target.value.toUpperCase());
    setInvoiceNo(e.target.value.toUpperCase());


  };



/*
  const formatInputInvoiceNo = async (e) => {
    e.preventDefault();
    // const cName = e.target.name;
    console.log(e.target.name);
    // alert(e.target.value);
    // e.target.value.replace(/[^a-z0-9\s]/gi, '');
    console.log(e.target.value.toUpperCase());
    setInvoiceNo(e.target.value.toUpperCase());


  };
*/


  const handleSelectInvoice = (ID, invoiceNo) => {
    // alert(gNo+' - '+gSub);
     setInvoiceNo(invoiceNo);
  /*
    Axios
    .get(url + `/companyInfo`,
      {
        params: {
          companyID: companyID,

        }
      }
    ).then(res => {

      setCompanyInfo(res.data);

    });
*/

  };








  const onPrintSalesInvoice = async () => {
/*
    let suppID=data[0].customerID;
  //alert(suppID);
    Axios
         .get(url + `/supplierSearch`,
           {
             params: {
               companyID: companyID,
               supplierID: suppID,
             }
           }
         )
         .then(res => {
           alert(res.data[0].supplierName+"**********");
           setCustomerInfo(res.data);
           alert(customerInfo[0].supplierName);
         })

*/

     if (data.length === 0) {
      alert('No Sales Invoice Data for printing');
      return false;
     }
     let invoiceType = 'Tax Invoice';
     let txnDate = new Date(data[0].invoiceDate);
     //format(new Date(date), "dd/MM/yyyy") ;
        txnDate = format(txnDate, "dd/MM/yyyy") ;
      // txnDate = txnDate.toISOString().substr(0, 10);
     for (let i = 0; i < data.length; i++) {
          if (data[i].taxType === 'SST' ) {
            invoiceType = 'Sales Invoice';
          }
          data[i].txnDate=txnDate;
          data[i].itemTax=data[i].taxItemTotal;
          data[i].salesQuantity=data[i].salesQty;
        //  data[0].salesRep = salesRep;
      //    data[0].salesParticular = salesParticular;
     }

     const newData = [...data];
     setCustomerInfo(newData);
     ExportInvoicePdf(data, companyInfo, customerInfo, invoiceType, invoiceTotal, invoiceDiscountTotal, invoiceTaxTotal, invoiceNetTotal)

  }

  // Add Purchase Item ******************************

  const handleNew = async () => {

    window.location.href = '/salesInvoiceListing';


  };

  const handleHome = async () => {


    window.location.href = '/home';
  };

  const handleCancel = async (e) => {
    //  alert('remove');
    setInvoiceData([]);
  };

  const onSearchInvoiceTransaction = async () => {
    if (invoiceNo === '') {
      alert('Invoice No. is empty');
      return false

    }
   //   alert(supplierID);
  Axios
    .get(url + `/loadInvoiceTransaction`,
    {
      params: {
        companyID: companyID,
        pur_sal: 'S',
        supplierID: supplierID,
        invoiceNo: invoiceNo,
      }
    }
  ).then(res => {
    if (res.data.length ===0) {
      alert('No Purchase Invoice Detail on Invoice No. '+invoiceNo);
    } else {
         let bal = 0;
         totalDrAmt=0;
         totalCrAmt=0;
         totalNetAmount=0;
      for (let i = 0; i < res.data.length; i++) {
        let  tDate = new Date(res.data.txnDate);
        //  tDate = tDate.toISOString().substr(0, 10);
            tDate=moment().format("DD/MM/YYYY")
        res.data[i].txnDate=tDate;
        //  res.data[i].txnDate=tDate;
          bal+=(res.data[i].drAmt - res.data[i].crAmt) ;
          res.data[i].taxRate = parseFloat(bal).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

          totalDrAmt+=res.data[i].drAmt;
          totalCrAmt+=res.data[i].crAmt;
          res.data[i].crAmt = parseFloat(res.data[i].crAmt).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
          res.data[i].drAmt = parseFloat(res.data[i].drAmt).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      }
          totalNetAmount = bal;
           setInvoiceTxn(res.data);


      }

  });


};



  //  inputReference.current.focus();
const onSearchInvoice = async () => {
if (invoiceNo === '') {
  alert('Invoice No. is empty');
  return false
}

  Axios
  .get(url + `/salesInvoiceDetail`,
    {
      params: {
        companyID: companyID,
        invoiceNo: invoiceNo,
      }
    }
  ).then(res => {

  //  setCompanyInfo(res.data);
      if (res.data.length ===0) {
        alert('No Sales Invoice Detail on Invoice No. '+invoiceNo);
      } else {
         setData(res.data);

         let invData = res.data;
            let itemTotal = 0;
            let itemDis = 0;
            let itemTax=0;
             let itemNet=0
           supplierID=invData[0].customerID;
            // alert(supplierID);
          for (let i = 0; i < invData.length; i++) {
              itemTotal+=invData[i].itemTotal;
               itemDis+=invData[i].itemDiscount;
               itemTax+=invData[i].taxItemTotal
               itemNet+=invData[i].itemNetTotal;
          }
          setInvoiceTotal(itemTotal);
          setInvoiceDiscountTotal(itemDis);
          setInvoiceTaxTotal(itemTax);
          setInvoiceNetTotal(itemNet);

        //  alert(supplierID);
      }

//  });

// supplierID=data[0].customerID;
//  alert(supplierID);
  Axios
       .get(url + `/supplierSearch`,
         {
           params: {
             companyID: companyID,
             supplierID: supplierID,
           }
         }
       )
       .then(res => {
        // alert(res.data[0].supplierName+"**********");
         setCustomerInfo(res.data);
      //   alert(customerInfo[0].customerName);
       })



});

};


  const onLoadInvoice = async () => {
    // Axios loadSalesInvoice


        Axios
        .get(url + `/loadSalesInvoice`,
          {
            params: {
              companyID: companyID,
              startDate: txnDate,
              endDate: dueDate,
            }
          }
        ).then(res => {

        //  setCompanyInfo(res.data);
            if (res.data.length ===0) {
              let sd= new Date(txnDate);

              let ed= new Date(dueDate);

              alert('No Sales Invoice record between '+ format(sd, "dd/MM/yyyy")+' and '+ format(ed, "dd/MM/yyyy"));
            } else {
              let invData=res.data;
              for (let i = 0; i < invData.length; i++) {
                let d = new Date(invData[i].txnDate);
                d.toLocaleDateString('en-GB');
                invData[i].txnDate=d.toLocaleDateString('en-GB');
                let invValue = parseFloat(invData[i].invoiceTotal).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                invData[i].invoiceTotal=invValue;
              }

                 setInvoiceData(invData);
            }


        });



  };

  // on Save Purchase Invoice and Voucher *******************




  const defaultSorted = [{
    dataField: 'supplierID',
    order: 'supplierID'
  }];

  const pagination = paginationFactory({
    page: 2,
    sizePerPage: 5,
    lastPageText: '>>',
    firstPageText: '<<',
    nextPageText: '>',
    prePageText: '<',
    showTotal: true,
    alwaysShowAllBtns: true,
    onPageChange: function (page, sizePerPage) {
      console.log('page', page);
      console.log('sizePerPage', sizePerPage);
    },
    onSizePerPageChange: function (page, sizePerPage) {
      console.log('page', page);
      console.log('sizePerPage', sizePerPage);
    }
  });






  return (




    <div>

      <div className="row">
        <div className="col-sm-12 btn btn-primary" style={{ marginTop: '1px' }}>
          List And Print Sales Invoice
        </div>
      </div>





      <label>

      <a style={{  marginRight: '.8rem' }} >Load Sales Invoice From Date : </a>
        <input
          type="date"
          maxLength={10}
          value={txnDate}
          style={{ width: '10%', border: '1px solid #696969' }}
          //  defaultValue = {txnDate}
          name="txnDate"
          onChange={(e) => formatInputDate(e)}
          required
        />

        <a style={{ marginLeft: '1rem', marginRight: '.8rem' }} >To Date : </a>
                <input
                  type="date"
                  maxLength={10}
                  value={dueDate}
                  style={{ width: '10%', border: '1px solid #696969' }}
                  name="dueDate"
                  onChange={(e) => formatInputDueDate(e)}
                  required
                />

                <button
                           style={{ padding: '6px' }}
                           type='button'
                           class='btn btn-primary fa fa-search float-right'
                           onClick={() => onLoadInvoice()}
                           data-tip data-for="invoiceSearchTip"
                         ></button>

<ReactTooltip
id="invoiceSearchTip" place="top" effect="solid">
        Press to load sales invoices on selected date
</ReactTooltip>
        <a style={{ marginLeft: '7.2rem', marginRight: '.2rem' }}> Sales Invoice No. : </a>
        <input
          type="text"
          style={{ width: '100px', border: '1px solid #696969' }}
          value={invoiceNo}
          name="invoice"
          class="text-uppercase"
          required
          readonly={true}
        />

 <button
            style={{ padding: '6px' }}
            type='button'
            class='btn btn-primary fa fa-search float-right'
            onClick={() => onSearchInvoice()}
            data-tip data-for="invoiceDetailTip"
          ></button>

<button
            style={ {padding: '6px'} }
            type='button'
            class='btn btn-warning fa fa-book float-right'
            onClick={() => onSearchInvoiceTransaction()}
            data-tip data-for="invoiceTxnTip"
          ></button>

<ReactTooltip
id="invoiceDetailTip" place="top" effect="solid">
        Select Sales Invoice From Sales Invoice Selection and Press this button to display Sales Invoice detail
</ReactTooltip>

<ReactTooltip
id="invoiceTxnTip" place="top" effect="solid">
        Press to load Sales Invoice transaction detail
</ReactTooltip>





      </label>






      <div className="select-container" >



        <p></p>


        <table class="table" style={{ paddingTop: '1px', border: '1px solid black' }}>
          <thead class="thead-dark" >
            <tr style={{ align: 'left' }}>
              <th style={{ backgroundColor: 'yellow', width: '.5px', textAlign: 'center' }}>#</th>
              <th style={{ backgroundColor: '#999999', width: '50px', textAlign: 'center' }}>Product</th>
              <th style={{ backgroundColor: 'yellow', width: '300px', textAlign: 'center' }}>Product Name</th>
              <th style={{ backgroundColor: '#999999', width: '10px', textAlign: 'center' }}>Quantity</th>
              <th style={{ backgroundColor: 'yellow', width: '1px', textAlign: 'center' }}>Unit</th>
              <th style={{ backgroundColor: '#999999', width: '5px', textAlign: 'center' }}>Tax Type</th>
              <th style={{ backgroundColor: 'yellow', width: '100px', textAlign: 'center' }}>Item Total</th>
              <th style={{ backgroundColor: '#999999', width: '40px', textAlign: 'center' }}>Discount</th>
              <th style={{ backgroundColor: 'yellow', width: '1px', textAlign: 'center' }}>Tax</th>
              <th style={{ backgroundColor: '#999999', width: '100px', textAlign: 'center' }}>Item Net Total</th>
              <th style={{ backgroundColor: 'yellow', width: '100px', textAlign: 'center' }}>Tax ID</th>
               </tr>
          </thead>
          <tbody style={mystyle} >
            {data.map(item => {
              return <tr key={item.id}>
                <td>{item.id}</td>

                <td style={{ backgroundColor: '#75bc7e', textAlign: 'left' }}>{item.productID}</td>
                <td style={{ textAlign: 'left' }}>{item.productName}</td>
                <td style={{ textAlign: 'right', backgroundColor: '#75bc7e' }}>{parseFloat(item.salesQty).toFixed(3).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</td>
                <td style={{ textAlign: 'center' }}>{item.unit}</td>
                <td style={{ textAlign: 'center', backgroundColor: '#75bc7e' }}>{item.taxType}</td>
                <td style={{ textAlign: 'right' }}>{parseFloat(item.itemTotal).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</td>
                <td style={{ textAlign: 'right', backgroundColor: '#75bc7e' }}>{parseFloat(item.itemDiscount).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</td>
                <td style={{ textAlign: "right" }}>{parseFloat(item.taxItemTotal).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</td>
                <td style={{ textAlign: "right", color: "blue",  backgroundColor: '#75bc7e'}}>{parseFloat(item.itemNetTotal).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</td>
                <td style={{ textAlign: 'left'}}>{item.taxID} </td>

              </tr>

            })}
            <td></td>
            <td></td>
            <td></td>
            <td></td>

            <td style={{ textAlign: "right", backgroundColor: "cyan" }}>Invoice</td>


            <td style={{ textAlign: "left", backgroundColor: "cyan" }}>Totals :</td>
            <td style={{ textAlign: "right", color: "red" }}>{parseFloat(invoiceTotal).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</td>
            <td style={{ textAlign: "right", color: "red" }}>{parseFloat(invoiceDiscountTotal).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</td>


            <td style={{ textAlign: "right", color: "red" }}>{parseFloat(invoiceTaxTotal).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</td>
            <td style={{ textAlign: "right", color: "red" }}>{parseFloat(invoiceNetTotal).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</td>


          </tbody>
          <tfoot>


            <td></td>
            <td></td>
            <td></td>



          </tfoot>
        </table>

        <div>

        </div>


        <p></p>


        <td><button style={{ backgroundColor: "green", color: "white", width: '250px', marginLeft: '10rem' }} onClick={() => onPrintSalesInvoice()}>Print Sales Invoice </button></td>
        <td><button style={{ backgroundColor: "grey", color: "white", width: '100px' }} onClick={() => handleHome()}>Home</button></td>
        <td><button style={{ backgroundColor: "blue", color: "white", width: '150px', marginLeft: '0rem' }} onClick={() => handleNew()}>New Listing </button></td>


        </div>

        <p></p>


            <div className="row">
            <div className="col-sx-10 btn btn-info" style={{ marginTop: '1px', paddingLeft: '10px' }}>
              Sales Invoice Selection

            </div>
            </div>

            <span class="square border border-dark"></span>

            <BootstrapTable bootstrap4 keyField='id' data={invoiceData} columns={columns}
              defaultSorted={defaultSorted} pagination={pagination}
              rowStyle={{ backgroundColor: '#A9A9A9', border: '3px solid grey' }}
              class="table border border-dark" ></BootstrapTable>


<div className="row">
<div className="col-sx-10 btn btn-warning" style={{ marginTop: '1px', paddingLeft: '10px' }}>
  Purchase Invoice Transaction Details
</div>
</div>
<table class="table" style={{ paddingTop: '1px', border: '1px solid black' }}>
          <thead class="thead-dark" >
            <tr style={{ align: 'left' }}>

              <th style={{ backgroundColor: '#999999', width: '100px', textAlign: 'center' }}>Txn. Date</th>
              <th style={{ backgroundColor: 'yellow', width: '200px', textAlign: 'center' }}>Invoice No.</th>
              <th style={{ backgroundColor: '#999999', width: '200px', textAlign: 'center' }}>Txn. Type</th>
              <th style={{ backgroundColor: 'yellow', width: '150px', textAlign: 'center' }}>Document No.</th>
              <th style={{ backgroundColor: '#999999', width: '150px', textAlign: 'center' }}>Receipt No.</th>
              <th style={{ backgroundColor: 'yellow', width: '550px', textAlign: 'center' }}>Txn. Particular</th>
              <th style={{ backgroundColor: '#999999', width: '150px', textAlign: 'center' }}>Debit Amount</th>
              <th style={{ backgroundColor: 'yellow', width: '150px', textAlign: 'center' }}>Credit Amount</th>
              <th style={{ backgroundColor: '#999999', width: '150px', textAlign: 'center' }}>Balance</th>


               </tr>
          </thead>
          <tbody style={mystyle} >
            {invoiceTxn.map(item => {
              return <tr key={item.id}>

                <td style={{ backgroundColor: '#75bc7e', textAlign: 'center' }}>{item.txnDate}</td>
                <td style={{ textAlign: 'left' }}>{item.invoiceNo}</td>
                <td style={{ textAlign: 'left', backgroundColor: '#75bc7e' }}>{item.txnType}</td>
                <td style={{ textAlign: 'left' }}>{item.documentNo}</td>
                <td style={{ textAlign: 'left', backgroundColor: '#75bc7e' }}>{item.receiptNo}</td>
                <td style={{ textAlign: 'left' }}>{item.txnParticular}</td>
                <td style={{ textAlign: 'right', backgroundColor: '#75bc7e' }}>{item.drAmt}</td>
                <td style={{ textAlign: "right" }}>{item.crAmt}</td>
                <td style={{ textAlign: "right" }}>{item.taxRate}</td>



              </tr>

            })}
            <td></td>
            <td></td>
            <td></td>
            <td></td>

          </tbody>
          <tfoot>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
             <td></td>
            <td style={{ textAlign: "right", backgroundColor: "cyan" }}>Totals :</td>
            <td style={{ textAlign: "right", color: "red", backgroundColor: "cyan"  }}>{parseFloat(totalDrAmt).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</td>
            <td style={{ textAlign: "right", color: "red", backgroundColor: "cyan"  }}>{parseFloat(totalCrAmt).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</td>
            <td style={{ textAlign: "right", color: "red", backgroundColor: "cyan"  }}>{parseFloat(totalNetAmount).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</td>





          </tfoot>

        </table>
         <tr></tr>





  </div>


  ) // return
};

export default SalesInvoiceListing;
