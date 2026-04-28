import { useState } from "react";
import Hero from "../components/Hero";
import Story from "../components/Story";
import Categories from "../components/Categories";
import Ratings from "../components/Ratings";
import InstagramPosts from "../components/InstagramPosts";
import Address from "../components/Address";
import Footer from "../components/Footer";
import DetailModal from "../components/DetailModal";
import { buildSocialLinks } from "../data";

export default function Home({
  categories,
  address,
  instagramPosts,
  onShowMoreReviews,
}) {
  const [selectedItem, setSelectedItem] = useState(null);
  const socialLinks = buildSocialLinks(address?.social);
  const instagramLink =
    socialLinks.find((link) => link.key === "instagram")?.href || "";

  const handleInstagramDetails = (post) => {
    setSelectedItem({
      ...post,
      desc: post.caption,
      category: "Instagram",
      type: "instagram",
    });
  };

  return (
    <>
      <Hero socialLinks={socialLinks} />
      <Story />
      <Categories categories={categories} onDetails={setSelectedItem} />
      <Ratings onShowMoreReviews={onShowMoreReviews} />
      <InstagramPosts
        posts={instagramPosts}
        onDetails={handleInstagramDetails}
        instagramLink={instagramLink}
      />
      <Address address={address} socialLinks={socialLinks} />
      <Footer address={address} socialLinks={socialLinks} />
      <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </>
  );
}
