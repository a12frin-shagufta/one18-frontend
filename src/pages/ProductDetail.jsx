import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { FiPlus, FiMinus, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { formatPrice } from "../utils/currency";
import FulfillmentModal from "../components/FulfillmentModal";

import {
  getBestOfferForItem,
  calculateDiscountedPrice,
} from "../utils/applyOffer";

const ProductDetail = () => {
  const { slug } = useParams();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { setOrders } = useCart();

  const [product, setProduct] = useState(null);
  const [offers, setOffers] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  // const [isCartOpen, setIsCartOpen] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showFulfillment, setShowFulfillment] = useState(false);

  /* ======================
     FETCH PRODUCT
  ====================== */
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BACKEND_URL}/api/menu/slug/${slug}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [slug]);

  /* ======================
     FETCH OFFERS
  ====================== */
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/offers`)
      .then((res) => setOffers(res.data || []))
      .catch(console.error);
  }, []);

  /* ======================
     APPLY OFFERS
  ====================== */
  const productWithOffer = useMemo(() => {
    if (!product) return null;

    const bestOffer = getBestOfferForItem(product, offers);

    const variants = (product.variants || []).map((v) => ({
      ...v,
      originalPrice: v.price,
      discountedPrice: calculateDiscountedPrice(v.price, bestOffer),
    }));

    return {
      ...product,
      variants,
      offer: bestOffer || null,
    };
  }, [product, offers]);

  /* ======================
     DEFAULT VARIANT
  ====================== */
  useEffect(() => {
    if (productWithOffer?.variants?.length) {
      setSelectedVariant(productWithOffer.variants[0]);
    }
  }, [productWithOffer]);

  /* ======================
     BASE PRICE ("From")
  ====================== */
  const basePrice = useMemo(() => {
    if (!productWithOffer?.variants?.length) return 0;
    return Math.min(
      ...productWithOffer.variants.map((v) => v.discountedPrice ?? v.price),
    );
  }, [productWithOffer]);

  /* ======================
     ADD TO CART
  ====================== */
  const addToCart = () => {
  if (!selectedVariant) return;

  const key = `${product._id}_${selectedVariant.label}`;
  console.log("PRODUCT:", product);

  setOrders((prev) => ({
    ...prev,
    [key]: {
      itemId: product._id,
      name: product.name,
      variant: selectedVariant.label,
      price: selectedVariant.discountedPrice ?? selectedVariant.price,
      qty,
      image: product.images?.[0],
      category: product.category, // ✅ ADD THIS
      isFestive: !!product.festival, 
       
    },
  }));

  const fulfillment = localStorage.getItem("fulfillmentData");

  if (!fulfillment) {
    setShowFulfillment(true);
  }
};

  /* ======================
     LOADING STATE
  ====================== */
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 animate-pulse">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="h-[420px] bg-gray-200 rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-2/3" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* ================= LEFT IMAGES ================= */}
        <div>
          <img
            src={product.images?.[activeImage]}
            alt={product.name}
            className="w-full h-[420px] md:h-[520px] object-cover rounded-xl"
          />

          {product.images?.length > 1 && (
            <div className="flex gap-3 mt-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border ${
                    activeImage === i
                      ? "border-[#1E3A8A] ring-2 ring-[#1E3A8A]"
                      : "border-gray-200"
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ================= RIGHT DETAILS ================= */}
        <div>
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>

          <p className="text-lg text-[#1E3A8A] font-semibold mb-4">
            From {formatPrice(basePrice)}
          </p>

          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* ================= VARIANT ACCORDION ================= */}
          <div className="border rounded-xl overflow-hidden mb-6">
            <button
              onClick={() => setAccordionOpen((o) => !o)}
              className="w-full flex justify-between items-center px-4 py-4 bg-gray-50"
            >
              <div>
                <p className="font-semibold">Choose from below</p>
                <p className="text-sm text-gray-500">Select 1</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {selectedVariant?.label}
                {accordionOpen ? <FiChevronUp /> : <FiChevronDown />}
              </div>
            </button>

            {accordionOpen && (
              <div className="divide-y">
                {productWithOffer.variants.map((v) => {
                  const diff = (v.discountedPrice ?? v.price) - basePrice;

                  return (
                    <label
                      key={v.label}
                      className="flex justify-between items-center px-4 py-4 cursor-pointer"
                    >
                      <div>
                        <p className="font-medium">{v.label}</p>
                        {diff > 0 && (
                          <p className="text-sm text-gray-500">
                            +{formatPrice(diff)}
                          </p>
                        )}
                      </div>

                      <input
                        type="radio"
                        checked={selectedVariant?.label === v.label}
                        onChange={() => setSelectedVariant(v)}
                        className="w-5 h-5 accent-[#1E3A8A]"
                      />
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* ================= QTY ================= */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="border p-2 rounded"
            >
              <FiMinus />
            </button>
            <span className="font-semibold">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="border p-2 rounded"
            >
              <FiPlus />
            </button>
          </div>

          {/* ================= ADD TO CART ================= */}
          <button
            onClick={addToCart}
            className="w-full bg-[#1E3A8A] text-white py-4 rounded-sm text-lg font-semibold"
          >
            ADD TO CART
          </button>
        </div>
      </div>

      {/* <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      /> */}
      <FulfillmentModal
        open={showFulfillment}
        onClose={() => setShowFulfillment(false)}
        redirectToCheckout={true}
      />
    </div>
  );
};

export default ProductDetail;
