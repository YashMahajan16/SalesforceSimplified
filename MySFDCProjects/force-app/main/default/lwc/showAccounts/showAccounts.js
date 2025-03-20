/**
 * @File Name          : showAccount.js
 * @Description        :
 * @Author             : Yash Mahajan
 * @Group              :
 * @Last Modified By   : Yash Mahajan
 * @Last Modified On   : 19-03-2025
 * @Modification Log   :
 * Ver       Date         Author 	    Modification
 * 1.0    19-03-2025   Yash Mahajan    Initial Version
 */
import { LightningElement, track, wire} from 'lwc';

// import { getRecords } from 'lightning/uiRecordApi';
// import ACCOUNT_NAME_FIELD from "@salesforce/schema/Account.Name";
// import ACCOUNT_TYPE_FIELD from "@salesforce/schema/Account.Type";
// import ACCOUNT_PHONE_FIELD from "@salesforce/schema/Account.Phone";
// import ACCOUNT_INDUSTRY_FIELD from "@salesforce/schema/Account.Industry";

import getAccounts from '@salesforce/apex/AccountHelper.getAccounts';

const columns = [
    { label:'Account Name', fieldName: 'accountLink', type: 'url', sortable:true,
        typeAttributes: {label: {fieldName: 'Name'}, tooltip:'Go to detail page', target: '_blank'}},
    { label: 'Type', fieldName: 'Type', type: 'text', sortable:true },
    { label: 'Industry', fieldName: 'Industry', type: 'text', sortable:true },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' }
];

export default class ShowAccounts extends LightningElement {

    error;
    columns = columns;
    allRecords; //All records fetched from apex controller 
    showTable = false; //Used to render table after we get the data from apex controller    
    recordsToDisplay = []; //Records to be displayed on the page
    rowNumberOffset; //Row number
    preSelected = [];
    selectedRows;

    @wire(getAccounts, {})
    accounts ({error, data}) {
        if (error) {
            // TODO: Error handling
            this.error = error;
        } else if (data) {
            // TODO: Data handling
            console.log('data => ', JSON.stringify(data));
            this.allRecords = data;
            let records = [];
            for(let i=0; i<data.length; i++){
                let record = {};
                record.rowNumber = ''+(i+1);
                record.accountLink = '/'+data[i].Id;                
                record = Object.assign(record, data[i]);                
                records.push(record);
            }
            this.allRecords = records;
            this.showTable = true;
        }
    }

    connectedCallback() {
        this.columns = columns;
    }

    //Capture the event fired from the paginator component
    handlePaginatorChange(event){
        this.recordsToDisplay = event.detail.recordsToDisplay;
        this.preSelected = event.detail.preSelected;
        if(this.recordsToDisplay && this.recordsToDisplay > 0){
            this.rowNumberOffset = this.recordsToDisplay[0].rowNumber-1;
        }else{
            this.rowNumberOffset = 0;
        } 
    }    

    getSelectedRows(event) {
        const selectedRows = event.detail.selectedRows;
        let selectedRecordIds = [];
        // Display that fieldName of the selected rows
        for (let i = 0; i < selectedRows.length; i++){
            console.log(selectedRows[i].Id);
            selectedRecordIds.push(selectedRows[i].Id);
        }     
        this.template.querySelector('c-datatable-utility').handelRowsSelected(selectedRecordIds);        
    }  
 
    handleAllSelectedRows(event) {
        this.selectedRows = [];
        const selectedItems = event.detail;          
        let items = [];
        selectedItems.forEach((item) => {
            this.showActionButton = true;
            console.log(item);
            items.push(item);
        });
        this.selectedRows = items;  
        console.log(this.selectedRows);        
    } 

    
    changeStyle() {
        //Generate Dynamic Values
        let mdata = [];
        this.allRecords.forEach(ele => {
            if(ele['Priority']){
                ele.priorityModified = ele.Priority === 'High' ? 'slds-text-color_error':'slds-text-color_success';            
            }  
            
            if(ele['Status']){
                ele.statusModified = ele.Status === 'Closed' ? `slds-is-edited`:``;            
            }              
            mdata.push(ele);
        });       
        this.allRecords = mdata;
        this.template.querySelector('c-datatable-utility').setRecordsOnPage(); 
    }      
}