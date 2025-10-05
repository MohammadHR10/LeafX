import React, { useState } from "react";

const products = [
  {
    id: 1,
    name: "Solar-Powered Desk Lamp",
    category: "Energy Efficiency",
    price: 39.99,
    description: "A sleek solar desk lamp that reduces electricity usage.",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 2,
    name: "Recycled Office Paper Pack",
    category: "Office Supplies",
    price: 12.5,
    description:
      "100% post-consumer recycled A4 paper — eco-certified and chlorine-free.",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 3,
    name: "Compostable Coffee Cups (Pack of 50)",
    category: "Kitchen",
    price: 18.0,
    description:
      "Made from corn-based bioplastic — industrially compostable and durable.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=60",
  },
  {
  id: 4,
  name: "Bamboo Keyboard & Mouse Set",
  category: "Electronics",
  price: 59.99,
  description:
    "Sustainably sourced bamboo design for modern eco-conscious offices.",
  image: "https://images.unsplash.com/photo-1616627452901-0f2ce2bdbb2e?auto=format&fit=crop&w=500&q=80",
},

];

const categories = ["All", "Energy Efficiency", "Office Supplies", "Kitchen", "Electronics"];

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);




  return (
    <div style={{ padding: "3rem 2rem", backgroundColor: "#f8fff8" }}>
      <h1 style={{ textAlign: "center", color: "green" }}>
        🌿 Sustainable Marketplace
      </h1>
      <p style={{ textAlign: "center", color: "#444", marginTop: "0.5rem" }}>
        Browse eco-friendly products designed for companies embracing sustainability.
      </p>

      {/* Category Buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", margin: "2rem 0" }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              backgroundColor: selectedCategory === cat ? "#a5d6a7" : "#e8f5e9",
              border: "none",
              padding: "0.5rem 1.2rem",
              borderRadius: "20px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "2rem",
          justifyContent: "center",
        }}
      >
        {filteredProducts.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: "#fff",
              padding: "1rem",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              textAlign: "center",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <img
              src={item.image}
              alt={item.name}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
            <h3 style={{ marginTop: "1rem" }}>{item.name}</h3>
            <p style={{ color: "green", fontWeight: "bold", margin: "0.5rem 0" }}>
              {item.category}
            </p>
            <p style={{ color: "#555", fontSize: "0.9rem" }}>{item.description}</p>
            <p style={{ fontWeight: "bold", marginTop: "0.5rem" }}>${item.price}</p>
            <button
              style={{
                backgroundColor: "green",
                color: "white",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


// import React, { useState } from "react";

// const Marketplace = () => {
//   // Dummy eco-friendly products
//   const [products] = useState([
//     {
//       id: 1,
//       name: "Solar-Powered Desk Lamp",
//       category: "Energy Efficiency",
//       description: "A sleek solar desk lamp that reduces electricity usage.",
//       price: "$39.99",
//       image:
//         "https://images.unsplash.com/photo-1602407294553-6b548b09b1c3?auto=format&fit=crop&w=400&q=60",
//     },
//     {
//       id: 2,
//       name: "Recycled Office Paper Pack",
//       category: "Office Supplies",
//       description:
//         "100% post-consumer recycled A4 paper — eco-certified and chlorine-free.",
//       price: "$12.50",
//       image:
//         "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=400&q=60",
//     },
//     {
//       id: 3,
//       name: "Compostable Coffee Cups (Pack of 50)",
//       category: "Kitchen",
//       description:
//         "Made from corn-based bioplastic — industrially compostable and durable.",
//       price: "$18.00",
//       image:
//         "https://images.unsplash.com/photo-1600359754716-440b8edb28b1?auto=format&fit=crop&w=400&q=60",
//     },
//     {
//       id: 4,
//       name: "Bamboo Keyboard & Mouse Set",
//       category: "Electronics",
//       description:
//         "Sustainably sourced bamboo design for modern eco-conscious offices.",
//       price: "$59.99",
//       image:
//         "https://images.unsplash.com/photo-1616628188539-f3d3cbb4a83d?auto=format&fit=crop&w=400&q=60",
//     },
//   ]);

//   const [filter, setFilter] = useState("All");

//   const categories = ["All", "Energy Efficiency", "Office Supplies", "Kitchen", "Electronics"];

//   const filteredProducts =
//     filter === "All"
//       ? products
//       : products.filter((p) => p.category === filter);

//   return (
//     <div style={styles.container}>
//       <h1 style={styles.heading}>🌿 Sustainable Marketplace</h1>
//       <p style={styles.subheading}>
//         Browse eco-friendly products designed for companies embracing sustainability.
//       </p>

//       {/* Category Filter */}
//       <div style={styles.filterBar}>
//         {categories.map((cat) => (
//           <button
//             key={cat}
//             style={{
//               ...styles.filterButton,
//               backgroundColor: filter === cat ? "#2e7d32" : "#e8f5e9",
//               color: filter === cat ? "white" : "#2e7d32",
//             }}
//             onClick={() => setFilter(cat)}
//           >
//             {cat}
//           </button>
//         ))}
//       </div>

//       {/* Product Grid */}
//       <div style={styles.grid}>
//         {filteredProducts.map((item) => (
//           <div key={item.id} style={styles.card}>
//             <img src={item.image} alt={item.name} style={styles.image} />
//             <h3 style={styles.name}>{item.name}</h3>
//             <p style={styles.category}>{item.category}</p>
//             <p style={styles.desc}>{item.description}</p>
//             <p style={styles.price}>{item.price}</p>
//             <button style={styles.btn}>Add to Cart</button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     padding: "50px 5%",
//     textAlign: "center",
//     backgroundColor: "#f8faf8",
//     minHeight: "100vh",
//   },
//   heading: {
//     color: "#2e7d32",
//     marginBottom: "8px",
//   },
//   subheading: {
//     color: "#555",
//     marginBottom: "25px",
//   },
//   filterBar: {
//     display: "flex",
//     justifyContent: "center",
//     flexWrap: "wrap",
//     gap: "10px",
//     marginBottom: "30px",
//   },
//   filterButton: {
//     border: "none",
//     padding: "10px 16px",
//     borderRadius: "20px",
//     cursor: "pointer",
//     fontWeight: "bold",
//     fontSize: "14px",
//   },
//   grid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//     gap: "25px",
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: "10px",
//     padding: "20px",
//     boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
//     transition: "transform 0.2s ease-in-out",
//   },
//   image: {
//     width: "100%",
//     height: "180px",
//     objectFit: "cover",
//     borderRadius: "8px",
//   },
//   name: {
//     marginTop: "15px",
//   },
//   category: {
//     fontSize: "13px",
//     color: "#2e7d32",
//     fontWeight: "600",
//   },
//   desc: {
//     fontSize: "14px",
//     color: "#555",
//     margin: "10px 0",
//   },
//   price: {
//     fontWeight: "bold",
//     margin: "8px 0",
//   },
//   btn: {
//     padding: "8px 16px",
//     border: "none",
//     backgroundColor: "#2e7d32",
//     color: "white",
//     borderRadius: "6px",
//     cursor: "pointer",
//   },
// };

// export default Marketplace;
