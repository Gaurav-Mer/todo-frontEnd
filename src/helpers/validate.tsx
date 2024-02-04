export function trimData(data: string): string {
  const trimmedData = data.replace(/^\s+|\s+$/g, "");

  return trimmedData;
}

export function returnTodayFormat() {
  const currentDate = new Date();
  interface DateTimeFormatOptions {
    weekday?: "short" | "long";
    year?: "numeric" | "2-digit";
    month?: "numeric" | "2-digit" | "short" | "long";
    day?: "numeric" | "2-digit";
    hour?: "numeric" | "2-digit";
    minute?: "numeric" | "2-digit";
    second?: "numeric" | "2-digit";
    // timeZoneName?: "short" | "long";
  }

  // Customize the format
  const options: DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    // timeZoneName: "short",
  };
  const formattedDateTime = currentDate.toLocaleString(undefined, options);

  return `Today, ${formattedDateTime}`;
}

export function returnDueDate() {
  const currentDate = new Date();
  interface DateTimeFormatOptions {
    year?: "numeric" | "2-digit";
    month?: "numeric" | "2-digit" | "short" | "long";
    day?: "numeric" | "2-digit";
    hour?: "numeric" | "2-digit";
    minute?: "numeric" | "2-digit";
    // timeZoneName?: "short" | "long";
  }

  // Customize the format
  const options: DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    // timeZoneName: "short",
  };
  const formattedDateTime = currentDate.toLocaleString(undefined, options);

  return formattedDateTime;
}

export function convertTo12HourFormat(time24: string) {
  // Parse the input time string into a Date object
  const timeParts = time24.split(":");
  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);

  // Create a Date object with a fixed date and the provided time
  const date = new Date(2000, 0, 1, hours, minutes);

  // Format the time in 12-hour format
  const options: any = { hour: "numeric", minute: "numeric", hour12: true };
  const time12 = date.toLocaleTimeString("en-US", options);

  return time12;
}

// Example usage:
const time24Format = "15:25";
const time12Format = convertTo12HourFormat(time24Format);
console.log(time12Format); // Output: "3:25 PM"
