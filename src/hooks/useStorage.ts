import { useEffect, useState } from "react";
import { fmt } from "../helpers/storageFormat";

export  function useStorage() {
  const [storageUsed, setStorageUsed] = useState<string>("Calculating..."); 
  const [usedValue,setUsedValue] = useState<number>(0);
  const [max,setMax] = useState<number>(100);
     useEffect(() => {
     if ("storage" in navigator && "estimate" in navigator.storage) {
       navigator.storage.estimate().then((estimate) => {
   
         const usageBytes = estimate?.usage ?? 0;
         const quotaBytes = estimate?.quota ?? 0;

         const usedMB = usageBytes / 1024 / 1024;
         const quotaMB = quotaBytes / 1024 / 1024;

 
         const remainingMB = quotaMB - usedMB;
          setUsedValue(Math.round(usedMB));
         setMax(remainingMB);
         const displayUnitQoute = quotaMB >= 1024 ? "GB" : "MB";
        const displayUnitUsed = usedMB >= 1024 ? "GB" : "MB";
         const remainingDisplay =
           quotaMB >= 1024
             ? fmt(remainingMB / 1024, 2) 
             : fmt(remainingMB, 2);

         const usedDisplay =
           usedMB >= 1024 ? fmt(usedMB / 1024, 2) : fmt(usedMB, 2);

         const finalString =
           quotaMB >= 1024
             ? `${usedDisplay} ${displayUnitUsed} used of ${remainingDisplay} ${displayUnitQoute} `
             : `${usedDisplay} MB used of ${remainingDisplay} MB remaining (~${fmt(
                 (usedMB / quotaMB) * 100,
                 1
               )}%)`;

         setStorageUsed(finalString);
       });
     } else {
       setStorageUsed("Not available");
     }
   }, []);
   return {storageUsed,usedValue,max};
}