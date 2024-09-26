import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [data, setData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);//trang hiện tại
  const perPage = 5; // Số lượng bản ghi trên mỗi trang
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("http://localhost:3000/users")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const allIds = data.map((user) => user.id);
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
  };

  const toggleRowSelection = (id) => {
    const currentIndex = selectedRows.indexOf(id);
    if (currentIndex === -1) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    }
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa không?");
    if (confirmDelete) {
      axios
        .delete(`http://localhost:3000/users/${id}`)
        .then((res) => {
          setData(data.filter((user) => user.id !== id));
          location.reload();
        })
        .catch((err) => console.log(err));
    }
  };

  const handleDeleteSelected = () => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa các bản ghi đã chọn không?");
    if (confirmDelete) {
      selectedRows.forEach((id) => {
        axios
          .delete(`http://localhost:3000/users/${id}`)
          .then((res) => {
            setData(data.filter((user) => user.id !== id));
            location.reload();
          })
          .catch((err) => console.log(err));
      });
      setSelectedRows([]);
      setSelectAll(false);
    }
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
  };

  // Lọc dữ liệu theo từ khóa tìm kiếm
  const filteredData = data.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Tính toán số lượng trang
  const totalPages = Math.ceil(filteredData.length / perPage);

  // Slice dữ liệu để hiển thị trang hiện tại
  const indexOfLastItem = currentPage * perPage;
  const indexOfFirstItem = indexOfLastItem - perPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="shadow-lg border">
      <div className="gradient-bg d-flex justify-content-between text-light p-2 mt-3 align-items-center">
        <p className="lead m-2">
          Manage <b>Employees</b>
        </p>
        <div className="d-flex p-2">
          <Link to="/create" className="btn btn-success">
            <i className="bi bi-dash-circle-fill me-1"> Add New Employees</i>
          </Link>
          <button
            className="btn btn-danger ms-2 me-2"
            onClick={handleDeleteSelected}
            disabled={selectedRows.length === 0}
          >
            Delete
          </button>
          <input
            type="text"
            placeholder="Searching..."
            className="form-control mt-2 "
            value={searchTerm}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="p-2 container">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th className="text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((user) => (
              <tr key={user.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(user.id)}
                    onChange={() => toggleRowSelection(user.id)}
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td className="text-end d-flex">
                  <Link
                    to={`/read/${user.id}`}
                    className="bi bi-pen-fill decor-pen me-2"
                  ></Link>
                  <i
                    className="bi bi-trash3-fill decor-trash"
                    onClick={() => handleDelete(user.id)}
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="d-flex justify-content-between align-items-center">
          <p>
            Showing <b>{currentData.length}</b> out of <b>{filteredData.length}</b> entries
          </p>

          <nav aria-label="Page navigation example">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }).map((_, index) => (
                <li
                  key={index}
                  className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Home;
