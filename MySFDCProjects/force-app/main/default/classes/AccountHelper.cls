/**
 * @File Name          : AccountHelper.cs
 * @Description        : Helper class for Account
 * @Author             : Yash Mahajan
 * @Group              :
 * @Last Modified By   : Yash Mahajan
 * @Last Modified On   : 19-03-2025
 * @Modification Log   :
 * Ver       Date         Author 	    Modification
 * 1.0    19-03-2025   Yash Mahajan    Initial Version
 */
public with sharing class AccountHelper {

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(){

        List<Account> accounts = new List<Account>();
        try {
            accounts = [SELECT Id, Name, Type, Industry, Phone FROM Account];
            return accounts;
        } catch (Exception e) {
            System.debug('Exception in getAccounts: ' + e.getMessage());
            return null;
        }        
    }
}