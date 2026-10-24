import { useEffect, useState } from "react";

import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";

function getRoute() {
  const hash = window.location.hash;

  if (hash === "#blog") {
    return {
      type: "blog",
    };
  }

  if (hash.startsWith("#blog/")) {
    return {
      type: "post",
      slug: hash.slice("#blog/".length),
    };
  }

  return {
    type: "home",
  };
}

export default function App() {
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRoute());
      window.scrollTo(0, 0);
    };

    window.addEventListener(
      "hashchange",
      handleHashChange,
    );

    return () => {
      window.removeEventListener(
        "hashchange",
        handleHashChange,
      );
    };
  }, []);

  if (route.type === "blog") {
    return <Blog />;
  }

  if (route.type === "post") {
    return (
      <BlogPost slug={route.slug} />
    );
  }

  return <Home />;
}