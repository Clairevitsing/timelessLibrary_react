import getStartedImg from "../assets/LibraryServices/get_started.jpeg";
import borrowBooksImg from "../assets/LibraryServices/borrow_books.jpg";

export const libraryServices = [
  {
    image: getStartedImg,
    title: "Get started",
    links: [
      { text: "Start your research on the web?", content: "Here is how to start research online..." },
      { text: "Using the Library search", content: "Library search helps you find books and articles..." },
      { text: "Researching by study area", content: "You can research by subject areas like Science or Arts..." },
      { text: "Finding information by type", content: "Find journals, books, and online articles easily..." },
    ],
  },
  {
    image: borrowBooksImg,
    title: "Borrow and request",
    links: [
      { text: "Borrow and return items", content: "You can borrow items for up to 3 weeks..." },
      { text: "Place hold and scan requests", content: "Reserve books online and request scans of pages..." },
      { text: "Manage your loans, renewals and requests", content: "Renew books and check due dates in your account..." },
      { text: "Request from other institutions", content: "Use interlibrary loan services to get external books..." },
    ],
  },
];
