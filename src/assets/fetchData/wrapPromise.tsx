type Status = "pending" | "success" | "error";

interface WrapPromiseResult<T> {
  read: () => T;
}

function wrapPromise<T>(promise: Promise<T>): WrapPromiseResult<T> {
  let status: Status = "pending";
  let response: T | any = ""; // Replace 'any' with the actual type you expect

  const suspender = promise.then(
    (res) => {
      status = "success";
      response = res;
    },
    (err) => {
      status = "error";
      response = err;
    }
  );

  const read = () => {
    switch (status) {
      case "pending":
        throw suspender;
      case "error":
        throw response;
      default:
        return response;
    }
  };

  return { read };
}

export default wrapPromise;
