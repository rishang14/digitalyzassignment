

export function isnonemptystring(val: any): boolean {
  return typeof val == "string" && val.trim().length > 0;
}

export function findDuplicatesIds(data: any[], key: string): number[] {
  const mp = new Map<string, number[]>();

  data.forEach((val, idx) => {
    const ids = val[key];
    if (!mp.has(ids)) {
      mp.set(ids, [idx]);
    } else {
      mp.get(ids)!.push(idx); // push it to the map  of the ids map;
    }
  });

  const duplicates: number[] = [];

  mp.forEach((indexes) => {
    if (indexes.length > 1) {
      duplicates.push(...indexes);
    }
  });
  return duplicates;
}

export function isvalidNumber(val: any): boolean {
  return /^-?\d+(\.\d+)?$/.test(val.trim()); // check via regex got from stack overflow no idea
}

export function isInrange(val: number): boolean {
  return val >= 1 && val <= 5;
}

export function isValidCommaSeparatedString(value: any): boolean {
   if (typeof value !== "string" || !value.trim()) return false;
  return value
    .split(",")
    .map(v => v.trim())
    .every(v =>/^[a-zA-Z0-9_\/-]+$/.test(v));
}

export function isValuepresent(key: any[], val: string): boolean {
  // split the comma operator then trim it and then fileter the " " string if available
  const ids = val
    .split(",")
    .map((v) => v.trim())
    .filter((i) => i !== " ");
  const taskidset = new Set(key);
  return ids.some((tid) => taskidset.has(tid));
}

export function isValidJSON(value: any): boolean {
  if (typeof value !== "string") return false;

  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}


export function isPreferredPhasesFormatValid(input: any): boolean {
  // Case 1: "1 - 3" format
  if (typeof input === "string") {
    const rangeRegex = /^\s*\d+\s*-\s*\d+\s*$/;
    if (rangeRegex.test(input)) {
      const [start, end] = input.split("-").map((v) => parseInt(v.trim(), 10));
      return start <= end;
    }

    // Case 2: "[1,2,3]" format (JSON array of integers)
    try {
      const parsed = JSON.parse(input);
      if (
        Array.isArray(parsed) &&
        parsed.every((val) => Number.isInteger(val))
      ) {
        return true;
      }
    } catch (e) {
      return false; // Not valid JSON
    }
  }

  // Not a valid string format
  return false;
}

export function isgreaterthanone(val: any): boolean {
  return val >= 1;
}

export function isValidInteger(value: any): boolean {
  if (value === null || value === undefined) return false;

  const str = String(value).trim();
  return /^-?\d+$/.test(str);
}


export function isValidPhaseArrayString(value: any): boolean {
  if (typeof value !== "string") return false;

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) return false;

    return parsed.every((item) => Number.isInteger(item) && item > 0);
  } catch (e) {
    return false;
  }
}

export function getallworkerSkill(worker: any): Set<string> {
  const skillset = new Set<string>();

  worker.forEach((w: any) => {
    const skills = w.Skills;

    if (isnonemptystring(skills) && isValidCommaSeparatedString(skills)) {
      skills
        .split(",")
        .map((i: any) => i.trim())
        .filter((s: any) => s != "")
        .forEach((s: any) => skillset.add(s));
    }
  });
  return skillset;
}

export function isSkillpresentInWorker(taskskill:any ,workerskill:Set<string> ):boolean{
    const skills = taskskill.split(",").map((s:any) => s.trim()).filter((s:any )=> s !== "");
  return skills.every((skill:any) => workerskill.has(skill));
} 

 
type ErrorInfo = { row: number; column: string; message: string };
export function convertErrorMap(errorMap: Record<number, Record<string, string>>): ErrorInfo[] {
  return Object.entries(errorMap).flatMap(([row, cols]) =>
    Object.entries(cols).map(([column, message]) => ({
      row: Number(row),
      column,
      message,
    }))
  );
} 