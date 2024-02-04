import wrapPromise from "./wrapPromise";

function fetchData(url: string): ReturnType<typeof wrapPromise> {
  // Can use axios too
  const promise = fetch(url)
    .then((res) => res.json())
    .then((res) => res);

  return wrapPromise(promise);
}

export default fetchData;
