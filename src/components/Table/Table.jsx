import "./Table.css";

const Table = ({
  columns = [],
  data = [],
}) => {
  return (
    <div className="table-container">

      <table className="custom-table">

        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.field}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>

          {data.length > 0 ? (

            data.map((row, index) => (

              <tr key={index}>

                {columns.map((column) => (

                  <td key={column.field}>
                    {row[column.field]}
                  </td>

                ))}

              </tr>

            ))

          ) : (

            <tr>

              <td
                colSpan={columns.length}
                className="no-data"
              >
                No Data Available
              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>
  );
};

export default Table;