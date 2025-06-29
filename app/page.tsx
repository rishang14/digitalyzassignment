"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Papa from "papaparse";

export default function Home(){
  const [files, setFiles] = useState<{
    client: File | null;
    worker: File | null;
    task: File | null;
  }>({
    client: null,
    worker: null,
    task: null,
  });  
  const inputRefs = {
    client: useRef<HTMLInputElement>(null),
    worker: useRef<HTMLInputElement>(null),
    task: useRef<HTMLInputElement>(null),
  };
  const router=useRouter();

  const parseCSV = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: any) => resolve(results.data),
        error: (err: any) => reject(err),
      });
    });
  };

  const handlesubmit = async (e: React.FormEvent) => { 
    e.preventDefault(); 
    const { client, worker, task } = files;
 // if any file is missing then alert it 
    if (!client || !worker || !task) {
      alert("uplaod all the files pls");
      return;
    }
 //so now get all the file parse it and save it in localstorage for now
    try {
      const [clients, workers, tasks] = await Promise.all([
        parseCSV(client),
        parseCSV(worker),
        parseCSV(task),
      ]);
      alert("Your  file is uplaoded ");
      setFiles({
        client: null,
        worker: null,
        task: null,
      });   
// save it to localestorage 
 localStorage.setItem("clientcsv",JSON.stringify(clients)); 
 localStorage.setItem("workercsv",JSON.stringify(workers)); 
 localStorage.setItem("taskcsv",JSON.stringify(tasks));
 // make the field empty
    if (inputRefs.client.current) inputRefs.client.current.value = "";
    if (inputRefs.worker.current) inputRefs.worker.current.value = "";
    if (inputRefs.task.current) inputRefs.task.current.value = "";
    } catch (error) {
      alert("something went wrong");
    } 

    router.push("/checkfiles");
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center relative   justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="absolute bg-slate-900 inset-0 -z-10   bg-[size:4rem_4rem] bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)]"></div>
      <div className=" md:mx-auto p-2">
        <h1 className="text-white text-2xl">
          Let us help you manage ur messy spreadsheet{" "}
        </h1>
      </div>
      <div className=" md:mx-auto container max-w-4xl  p-2   border-1 rounder-full">
        <h1 className="text-xl text-center  text-white">
          Upload your Files here
        </h1>
        <div className="flex  p-2  items-center justify-center">
          <form
            onSubmit={handlesubmit}
            className="flex flex-col items-center p-2"
          >
            <div className="space-y-2 p-2">
              <Label htmlFor="picture" className="text-white">
                Client File here
              </Label>
              <Input
                type="file" 
                id="client" 
                ref={inputRefs.client}
                className="placeholder:text-white text-white"
                onChange={(e) =>
                  setFiles((prev) => ({
                    ...prev,
                    client: e.target.files?.[0] || null,
                  }))
                }
                accept=".csv"
                required
              />
            </div>
            <div className="space-y-2 p-2">
              <Label htmlFor="picture" className="text-white">
                Worker file here
              </Label>
              <Input
                id="worker"
                type="file" 
                ref={inputRefs.worker}
                className=" placeholder:text-white text-white"
                onChange={(e) =>
                  setFiles((prev) => ({
                    ...prev,
                    worker: e.target.files?.[0] || null,
                  }))
                }
                accept=".csv"
                required
              />
            </div>
            <div className="space-y-2 p-2">
              <Label htmlFor="picture" className="text-white">
                Task file here{" "}
              </Label>
              <Input
                id="task"
                type="file" 
                ref={inputRefs.task}
                required
                onChange={(e) =>
                  setFiles((prev) => ({
                    ...prev,
                    task: e.target.files?.[0] || null,
                  }))
                }
                className="placeholder:text-white text-white"
                accept=".csv"
              />
            </div>
            <Button
              type="submit"
              variant={"outline"}
              className="cursor-pointer"
            >
              {" "}
              Uplaod ur file{" "}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
