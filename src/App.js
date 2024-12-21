import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

function App() {
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState(false);
  const [emailList, setEmailList] = useState([]);

  function handlemsg(event) {
    setMsg(event.target.value);
  }

  function handlefile(event) {
    const file = event.target.files[0];

    if (!file) {
      console.error("No file selected.");
      return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: "A" });
      const totalemail = emailList.map(function (item) {
        return item.A;
      });
      console.log(totalemail);
      setEmailList(totalemail);
    };

    reader.readAsArrayBuffer(file);
  }

  function send() {
    setStatus(true);
    axios
      .post("https://bulkmail-be-1fxv.onrender.com/sendemail", { msg: msg, emailList: emailList })
      .then(function (data) {
        if (data.data == true) {
          alert("Email Sent Successfully");
          setStatus(false);
        } else {
          alert("Failed");
        }
      });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <header className="text-center py-6 bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
        <h1 className="text-4xl font-bold">Bulk Mail</h1>
        <p className="text-lg mt-2">Send bulk emails effortlessly</p>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <section className="mb-6 bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Enter Your Message</h2>
          <textarea
            onChange={handlemsg}
            value={msg}
            className="w-full h-32 p-4 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter the email text"
          ></textarea>
        </section>

        <section className="mb-6 bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Upload Email List</h2>
          <input
            onChange={handlefile}
            type="file"
            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600"
          />
          <p className="mt-4">Total Emails in the file: {emailList.length}</p>
        </section>

        <section className="text-center">
          <button
            onClick={send}
            className={`px-6 py-3 rounded-lg font-semibold text-white ${
              status ? "bg-gray-500 cursor-not-allowed" : "bg-purple-500 hover:bg-purple-600"
            }`}
            disabled={status}
          >
            {status ? "Sending..." : "Send"}
          </button>
        </section>
      </main>

      <footer className="text-center py-6 bg-gray-800 mt-10">
        <p className="text-sm text-gray-400">&copy; 2024 Bulk Mail App. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
