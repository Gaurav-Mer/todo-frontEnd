const TodoLoader = () => {
  return (
    <>
      <div className="card mt-4" aria-hidden="true">
        <div className="card-body placeholder-wave rounded-2">
          <span
            className="placeholder placeholder-glow rounded-2  col-12 bg-info"
            style={{ height: 40 }}
          ></span>
          <span
            className="placeholder placeholder-wave rounded-2 col-12 mt-2 bg-info"
            style={{ height: 80 }}
          ></span>
          <span
            className="placeholder col-12 mt-1 rounded-2 placeholder-glow  bg-info "
            style={{ height: 40 }}
          ></span>
        </div>
      </div>
    </>
  );
};
export default TodoLoader;
