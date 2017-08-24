pragma solidity ^0.4.0;

import "./strings.sol";

contract DomainNameRegistry {
    
    using strings for *;
    
    mapping(string => string) domainMapping;
    mapping(string => address) owners;
    
    string extension = ".myeth";
    
    function lookup(string domainName) returns (string) {
        return domainMapping[domainName];
    }
    
    function registerDomain(string domainAddress, string domainName) returns (string) {
        
        if(!checkDomainName(domainName)) {
            return "Domain name must end in .myeth";
        }
        
        //owner already exists for this domain
        if(owners[domainName] != address(0)) 
            return "Domain already taken";
        
        domainMapping[domainName] = domainAddress;
        owners[domainName] = msg.sender;
        
        return "Domain registered successfully";
    }
    
    function changeAddress(string domainName, string newAddress) returns (string) {
        
        //if we are the owner of that domain
        if(msg.sender == owners[domainName]) {
            
            domainMapping[domainName] = newAddress;
            
            return "Domain changed successfully";
        }
        
    }
    
    function changeOwnership(string domainName, address newOwner) returns (string) {
        //if we are the owner of that domain
        if(msg.sender == owners[domainName]) {
            
            owners[domainName] = newOwner;
            
            return "Domain owner changed successfully";
        }   
    }
    
    function checkDomainName(string domainName) returns (bool) {
        var domain = domainName.toSlice();
        
        if(domain.endsWith(extension.toSlice())) {
            return true;
        }
            
        return false;
    }
}