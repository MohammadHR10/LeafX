import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";

function App() {
  const [message, setMessage] = useState("");

  // // 🔹 Test connection to backend
  // useEffect(() => {
  //   fetch("/api/message")
  //     .then((res) => {
  //       if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
  //       return res.json();
  //     })
  //     .then((data) => setMessage(data.text))
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //       setMessage("Failed to load message from backend 😢");
  //     });
  // }, []);

  return (
    <div>
      {/* 🌿 Navbar at top */}
      <Navbar />

      {/* 🏠 Home page (mission + chatbot) */}
      <Home />

      {/* ⚙️ Backend connectivity status at bottom
      <div style={{ textAlign: "center", margin: "3rem 0", color: "gray" }}>
        <p>🔌 Backend Status: {message || "Loading..."}</p>
      </div> */}
    </div>
  );
}

export default App;



// import { useEffect, useState } from "react";

// function App() {
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     // ✅ Always start with a leading slash for proxy to work
//     fetch("/api/message")
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error(`HTTP error! Status: ${res.status}`);
//         }
//         return res.json();
//       })
//       .then((data) => setMessage(data.text))
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//         setMessage("Failed to load message from backend 😢");
//       });
//   }, []);

//   return (
//     <div style={{ textAlign: "center", marginTop: "100px" }}>
//       <h1>{message || "Loading..."}</h1>
//     </div>
//   );
// }

// export default App;

// import { useEffect, useState } from "react";

// function App() {
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     fetch("api/message")
//       .then((res) => res.json())
//       .then((data) => setMessage(data.text));
//   }, []);

//   return (
//     <div>
//       <h1>{message}</h1>
//     </div>
//   );
// }

// export default App;


// // import logo from './logo.svg';
// // import './App.css';

// // // function App() {
// //   return (
// //     <div className="App">
// //       <header className="App-header">
// //         <img src={logo} className="App-logo" alt="logo" />
// //         <p>
// //           Edit <code>src/App.js</code> and save to reload.
// //         </p>
// //         <a
// //           className="App-link"
// //           href="https://reactjs.org"
// //           target="_blank"
// //           rel="noopener noreferrer"
// //         >
// //           Learn React
// //         </a>
// //       </header>
// //     </div>
// //   );
// // }

// // export default App;
