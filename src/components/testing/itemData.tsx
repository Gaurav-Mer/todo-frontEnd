import fetchData from "../../assets/fetchData";

interface ResponseData {
  products?: any[] | undefined;
}

const fetchDatas = fetchData("https://dummyjson.com/products");

const ItemData = () => {
  const resp = fetchDatas.read() as ResponseData;

  return (
    <>
      {resp?.products?.map((item: any) => (
        <p className="p-3 bg-body-secondary" key={item?.id}>
          {item?.title}
        </p>
      ))}
    </>
  );
};

export default ItemData;
