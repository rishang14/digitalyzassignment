import { findDuplicatesIds, isInrange, isnonemptystring, isValidCommaSeparatedString, isValidJSON, isvalidNumber, isValuepresent } from "@/lib/helper";

type ErrorMap = {
  [index: number]: {
    [field: string]: string; // field name → error message
  };
};

type GlobalErrors = {
  missingFields?: string[];
};

const REQUIRED_FIELDS = [
  "ClientID",
  "ClientName",
  "PriorityLevel",
  "RequestedTaskIDs",
  "GroupTag",
  "AttributesJSON",
];

// things i have to check
// clientid is string
// priority is number should be greater than 1 smaller than 5
// task id is string seprated by commas
//taskid is available or not
// group tag string
// attribute json is valid json or not

function useClientvalidation(
  client: any,
  tasksfile: any
): {
  clienterrors: ErrorMap;
  clientglobalErrors: GlobalErrors;
} {
  const clienterrors: ErrorMap = {};
  const clientglobalErrors: GlobalErrors = {};

  // check for required field is avialble or not
  const clientheader = Object.keys(client[0] || {}).map(h => h.toLowerCase());
  //check for header
  const missingHeaderFileds = REQUIRED_FIELDS.filter(
    (item) => !clientheader.includes(item.toLowerCase())
  );
  if (missingHeaderFileds.length > 0) {
    clientglobalErrors.missingFields = missingHeaderFileds;
  }
  // got all the taskids
  const taskids = tasksfile.map((item: any) => item.TaskID);  
  // got all the duplicates clientidx 
  const duplicatesclientidx= findDuplicatesIds(client,"ClientID"); 
 
  client.forEach((item:any,index:number) => { 
    const rowerror :{ [key: string]: string } = {}; 
   // ckeck for types and available in tasks and group and taskids seperated by , and has to be string 
     if(!isnonemptystring(item.ClientID)){
        rowerror.ClientID= "ClientiD should be non empty string"
     }  
     // client id duplictes found 
     if(duplicatesclientidx.includes(index)){
        rowerror.ClientID="Duplicate client Id found"; 
     }  
     // clientName 
     if(!isnonemptystring(item.ClientName)){
      rowerror.ClientName="ClientName cant be empty"
     }

     // priority level check 
     if(!isvalidNumber(item?.PriorityLevel)){
        rowerror.PriorityLevel="Privority level should be Number only"
     }else if(isvalidNumber(item.PriorityLevel)){
        if(!isInrange(+item.PriorityLevel)){
            rowerror.PriorityLevel="Number should be in between 1 to 5";
        }
     }
    // taskid    
     if(!(isnonemptystring(item?.RequestedTaskIDs) && isValidCommaSeparatedString(item.RequestedTaskIDs))){
         rowerror.RequestedTaskIDs= "Correct the format or type of Takids";
     }else if(!isValuepresent(taskids,item?.RequestedTaskIDs)){
        rowerror.RequestedTaskIDs="No Task with this id is present"
     } 

     // valid json  
     if(!isValidJSON(item?.AttributesJSON)){
        rowerror.AttributesJSON= "Pls provide the valid json"
     }  

     // grouptag 
     if(!isnonemptystring(item?.GroupTag)){
        rowerror.GroupTag="Group tag should not be empty or provide valid data ";
     } 

  // if  you got any error put it inside the error tag 
     if(Object.keys(rowerror).length > 0 ){
        clienterrors[index] = rowerror;
     }  
   })

  return { clientglobalErrors, clienterrors };
}

export default useClientvalidation;
