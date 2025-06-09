// MainContainer.jsx
import React from "react";
import PageCard from "./pageCard";
import Navbar from "./navbar";

export default function PaginaPrincipal() {
  const cards = [
    {
      title: "Nome do grupo 1",
      image:
        "https://i.pinimg.com/736x/77/e5/ef/77e5ef50029fc3a1263b9261ed272115.jpg",
      link: "#",
    },
    {
      title: "Nome do grupo 2",
      image:
        "https://i.pinimg.com/736x/77/e5/ef/77e5ef50029fc3a1263b9261ed272115.jpg",
      link: "#",
    },
    {
      title: "Nome do grupo 3",
      image:
        "https://i.pinimg.com/736x/77/e5/ef/77e5ef50029fc3a1263b9261ed272115.jpg",
      link: "#",
    },
    {
      title: "Nome do grupo 3",
      image:
        "https://i.pinimg.com/736x/77/e5/ef/77e5ef50029fc3a1263b9261ed272115.jpg",
      link: "#",
    },
    {
      title: "Nome do grupo 2",
      image:
        "https://i.pinimg.com/736x/77/e5/ef/77e5ef50029fc3a1263b9261ed272115.jpg",
      link: "#",
    },
    {
      title: "Nome do grupo 3",
      image:
        "https://i.pinimg.com/736x/77/e5/ef/77e5ef50029fc3a1263b9261ed272115.jpg",
      link: "#",
    },
    {
      title: "Nome do grupo 3",
      image:
        "https://i.pinimg.com/736x/77/e5/ef/77e5ef50029fc3a1263b9261ed272115.jpg",
      link: "#",
    },
  ];

  return (
    <>
      <div className="containerPaginas">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {cards.map((card, index) => (
            <PageCard key={index} {...card} />
          ))}
        </div>
      </div>
    </>
  );
}
