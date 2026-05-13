import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Reviews from "./pages/Reviews";
import {
  initialCategories,
  initialAddress,
  initialInstagramPosts,
} from "./data";
import { businessInfoApi, categoriesApi, instagramApi } from "./services/api";

export default function App() {
  const [page, setPage] = useState("home");
  const [categories, setCategories] = useState(initialCategories);
  const [address, setAddress] = useState(initialAddress);
  const [instagramPosts, setInstagramPosts] = useState(initialInstagramPosts);

  useEffect(() => {
    let mounted = true;

    async function loadHomeData() {
      try {
        const [apiCategories, apiAddress, apiInstagram] = await Promise.all([
          categoriesApi.list(),
          businessInfoApi.get(),
          instagramApi.list(6),
        ]);

        if (!mounted) return;
        setCategories(apiCategories);
        setAddress(apiAddress);
        setInstagramPosts(apiInstagram);
      } catch (error) {
        console.error("Failed to load backend data:", error.message);
      }
    }

    loadHomeData();
    return () => {
      mounted = false;
    };
  }, [setAddress, setCategories, setInstagramPosts]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <>
      <Nav page={page} setPage={setPage} />

      <AnimatePresence mode="wait">
        {page === "admin" ? (
          <motion.div
            key="admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Admin
              categories={categories}
              setCategories={setCategories}
              address={address}
              setAddress={setAddress}
              instagramPosts={instagramPosts}
              setInstagramPosts={setInstagramPosts}
            />
          </motion.div>
        ) : page === "reviews" ? (
          <motion.div
            key="reviews"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Reviews />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Home
              categories={categories}
              address={address}
              instagramPosts={instagramPosts}
              onShowMoreReviews={() => setPage("reviews")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
