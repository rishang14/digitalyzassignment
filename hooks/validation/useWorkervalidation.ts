import { findDuplicatesIds, isnonemptystring, isValidCommaSeparatedString, isValidInteger, isValidPhaseArrayString } from "@/lib/helper";

type ErrorMap = {
  [index: number]: {
    [field: string]: string; // field name → error message
  };
};

type GlobalErrors = {
  missingFields?: string[];
}; 

const REQUIRED_FIELDS = [
 "WorkerID", "WorkerName", "Skills", "AvailableSlots", "MaxLoadPerPhase",
"WorkerGroup", "QualificationLevel"
]; 

function useWokervalidation(workerfile:any):{
    workererror: ErrorMap;
  workerglobalErrors: GlobalErrors;
}{
    const workererror:ErrorMap={}; 
    const workerglobalErrors:GlobalErrors={};  
    const workerheader= Object.keys(workerfile[0] || {}).map(item => item.toLowerCase());  
    const duplicateworkid= findDuplicatesIds(workerfile,"WorkerID");  
    const missingFields= REQUIRED_FIELDS.filter(item => !workerheader.includes(item.toLowerCase())); 
    if(missingFields.length > 0){ 
        workerglobalErrors.missingFields=missingFields;
    } 

    workerfile.forEach((item:any,idx:number)=>{
      const rowerror:{[key:string]:string}={}; 
     // id cant be empty 
      if(!isnonemptystring(item.WorkerID)){
        rowerror.WorkerID="WorkerID should be non empty string"; 
      }  
      // name 
      if(!isnonemptystring(item.WorkerName)){
        rowerror.WorkerName="WorkerName cant be empty"
      }
    // id has to be unique 
    if(duplicateworkid.includes(idx)){
        rowerror.WorkerID="WorkerID should be unique"; 
    } 
    // Skills 
    if(!(isnonemptystring(item.Skills) && isValidCommaSeparatedString(item.Skills))){
        rowerror.Skills="Skills should be non valid comma separated ";
    } 

    // WorkerGroup 
    if(!isnonemptystring(item.WorkerGroup)){
        rowerror.WorkerGroup="WorkerGroup should be non empty string" ;
    } 
    //MaxLoadPerPhase 
    if(!isValidInteger(item.MaxLoadPerPhase)){
        rowerror.MaxLoadPerPhase="It should be valid integer" ;
    }
   //AvailableSlots 
    if(!isValidPhaseArrayString(item.AvailableSlots)){
        rowerror.AvailableSlots="AvailableSlots should be valid phrase string "
    }
    

     if(Object.keys(rowerror).length > 0 ){
        workererror[idx]=rowerror;
     }

    })

    return {workererror,workerglobalErrors};
}


export default useWokervalidation;