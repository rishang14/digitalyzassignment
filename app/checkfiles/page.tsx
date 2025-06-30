"use client";
import useClientvalidation from "@/hooks/validation/useClientvalidation";
import useTaskvalidation from "@/hooks/validation/useTaskvalidation";
import useWokervalidation from "@/hooks/validation/useWorkervalidation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import ReusableTable from "@/components/Table";
// got the client workers and task details add validation and show it in a table thats it
//steps follow   start with client creast a func or  custom hook  that return all the error via mapping with idx onl bcz even client id can be "
// "  or missing or not uniqure so i have to map errror with idx and to find unique id and many more thing use set to identify that
// client func will check
// all fields are not empty
// uniqure client id
// priorty cnt be greater > 5 and < 1
// look in taask for some chekc and many more

const Page = () => {
  const [activeTab, setactiveTab] = useState("client");
  const [clientdetails, setclientdetails] = useState([]);
  const [workerdetails, setworkerdetails] = useState([]);
  const [taskdetails, settaskdetails] = useState([]);
  const { clienterrors, clientglobalErrors } = useClientvalidation(
    clientdetails,
    taskdetails
  );
  const { taskerrors, taskglobalErrors } = useTaskvalidation(
    taskdetails,
    workerdetails
  );
  const { workererror, workerglobalErrors } = useWokervalidation(workerdetails);
  console.log(workerglobalErrors, "error");
  console.log(workerglobalErrors, "errore");
  console.log(clientglobalErrors);
  useEffect(() => {
    // datas are retrived from storage
    const clientcsv = localStorage.getItem("clientcsv");
    const workercsv = localStorage.getItem("workercsv");
    const taskcsv = localStorage.getItem("taskcsv");
    // checked if datas are avial
    if (clientcsv && workercsv && taskcsv) {
      const client = JSON.parse(clientcsv);
      const worker = JSON.parse(workercsv);
      const taskfile = JSON.parse(taskcsv);
      console.log(worker, "file");
      // set it in to the file
      setclientdetails(client);
      setworkerdetails(worker);
      settaskdetails(taskfile);
    }
  }, []);

  if (!clientdetails) return <p className="text-black">loading</p>;
  return (
    <div className="   w-full h-full p-3 ">
      <div className=" m-auto max-w-7xl">
        <Tabs
          defaultValue="basic"
          className="w-full p-2 "
          value={activeTab}
          onValueChange={setactiveTab}
        >
          <TabsList className=" w-full bg-gray-100 p-2 border-1  rounded-sm ">
            <TabsTrigger
              value="client"
              className="flex items-center gap-2 p-3 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-md transition-colors"
            >
              Client
            </TabsTrigger>
            <TabsTrigger
              value="worker"
              className={`flex items-center gap-2 p-3 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-md transition-colors `}
            >
              Woker
            </TabsTrigger>
            <TabsTrigger
              value="task"
              className={`flex items-center p-3 gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-md transition-colors`}
            >
              Task
            </TabsTrigger>
          </TabsList>
          <TabsContent value="client" className="space-y-6 mt-6">
            {Object.keys(clientglobalErrors).length > 0 ? (
              clientglobalErrors.missingFields?.map(
                (item: any, idx: number) => (
                  <p key={idx} className="text-white">
                    These fields are missing: {item} from header
                  </p>
                )
              )
            ) : (
              <ReusableTable
                setTabledata={setclientdetails}
                tabledata={clientdetails}
                localestoragekey="clientcsv"
                tableerror={clienterrors}
              />
            )}
          </TabsContent>
          <TabsContent value="worker" className="space-y-6 mt-6">
            {Object.keys(workerglobalErrors).length > 0 ? (
              workerglobalErrors.missingFields?.map(
                (item: any, idx: number) => (
                  <p key={idx} className="text-black">
                    These fields are missing: {item} from header 
                  </p>
                )
              )
            ) : (
              <ReusableTable
                setTabledata={setworkerdetails}
                tabledata={workerdetails}
                localestoragekey="workercsv"
                tableerror={workererror}
              />
            )}
          </TabsContent>
          <TabsContent value="task" className="space-y-6 mt-6">
            {Object.keys(taskglobalErrors).length > 0 ? (
              taskglobalErrors.missingFields?.map((item: any, idx: number) => (
                <p key={idx} className="text-white">
                  These fields are missing: {item} from header 
                </p>
              ))
            ) : (
              <ReusableTable
                setTabledata={settaskdetails}
                tabledata={taskdetails}
                localestoragekey="taskcsv"
                tableerror={taskerrors}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Page;
