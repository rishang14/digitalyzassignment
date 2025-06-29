'use client'
import React, { useMemo, useState } from "react"; 
import { Table, TableBody,TableHeader,TableRow, TableHead , TableCell } from "./ui/table"; 
import { TooltipProvider,Tooltip,TooltipContent,TooltipTrigger } from "./ui/tooltip";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Edit, Save } from "lucide-react";
import { convertErrorMap } from "@/lib/helper"; 


const ReusableTable = ({
  setTabledata,
  tabledata,
  tableerror,
  localestoragekey,
}: any) => { 
    const [editableRow,setedittablerow]= useState(Infinity);
  let keys: Array<string>=[];
  if (tabledata.length > 0) {
    keys = Object.keys(tabledata[0]);
    keys.push("Action");
  } 

 
// conveted the error map into this  and wrap it inside memo so it doesnt has to create again and again unless it change
const errorInfo = useMemo(() => convertErrorMap(tableerror), [tableerror]);

const hasError = (row: number, column: string): boolean =>{
  return  errorInfo.some((e) => e.row === row && e.column === column);
}

    const handlesave = (e: React.ChangeEvent<HTMLInputElement>, key: string, rowIndex: number) => { 
        // spread all the data 
  const updated = [...tabledata]; 
  //updated with new one 
  updated[rowIndex][key] = e.target.value;
  // Save updated data
  setTabledata(updated); 
  //save it to localstoreage again
  localStorage.setItem(localestoragekey, JSON.stringify(updated));
  
};

    

const getError = (row: number, column: string): string => {
  const err = errorInfo.find((e) => e.row === row && e.column === column);
  return err?.message || "";
};
  return (
     <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="w-16">No.</TableHead>
        {keys.map((key, idx) => (
          <TableHead key={idx} className={key === "Action" ? "w-48" : ""}>
            {key}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>

    <TableBody>
      {tabledata.map((data: any, index: number) => (
        <TableRow key={index}>
          <TableCell className="font-medium text-center">
            {index + 1}
          </TableCell>

          {keys.map((key, idx) => (
            <TableCell key={idx}>
              {key === "Action" ? (
                <div className="flex gap-2">
                  {editableRow === index ? (
                    <Button
                      size="sm"
                      onClick={() => setedittablerow(Infinity)}
                      className="h-8"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setedittablerow(index)}
                      className="h-8"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              ) : editableRow === index ? (
                <Input
                  value={data[key] || ""}
                  onChange={(e) =>
                    handlesave(e,key,index) 
                  }
                  className={`h-8 ${
                    hasError(index, key) ? "border-red-500 bg-red-50" : ""
                  }`}
                />
              ) : hasError(index, key) ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-red-50 border border-red-300 text-red-600 p-1 rounded">
                        {data[key]}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="bg-destructive text-white text-sm max-w-xs"
                    >
                      {getError(index, key)}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <span className="text-sm">{data[key]}</span>
              )}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>
  );
};

export default ReusableTable;
