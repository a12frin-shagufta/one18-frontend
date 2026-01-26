import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { FiPlus, FiMinus } from "react-icons/fi";
import { formatPrice } from "../utils/currency";
import CartDrawer from "../components/CartDrawer";
import {
  getBestOfferForItem,
  calculateDiscountedPrice,
} from "../utils/applyOffer";

const ProductDetail = () => {
  const { slug } = useParams();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { setOrders } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [offers, setOffers] = useState([]);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BACKEND_URL}/api/menu/slug/${slug}`);
        setProduct(res.data);

        if (res.data.variants?.length) {
          setSelectedVariant(res.data.variants[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/offers`)
      .then((res) => setOffers(res.data || []))
      .catch(console.error);
  }, []);

  const productWithOffer = useMemo(() => {
    if (!product) return null;

    const bestOffer = getBestOfferForItem(product, offers);

    const updatedVariants = (product.variants || []).map((v) => {
      const originalPrice = v.price;
      const discountedPrice = calculateDiscountedPrice(
        originalPrice,
        bestOffer,
      );

      return {
        ...v,
        originalPrice,
        discountedPrice,
      };
    });

    return {
      ...product,
      offer: bestOffer || null,
      variants: updatedVariants,
    };
  }, [product, offers]);

  useEffect(() => {
    if (productWithOffer?.variants?.length) {
      setSelectedVariant(productWithOffer.variants[0]);
    }
  }, [productWithOffer]);

  const handleAddToCart = () => {
    // Your existing add to cart logic
    addToCart(product);

    // Open the drawer instead of navigating
    setIsCartOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 animate-pulse">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-gray-200 h-96 rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-2/3" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  const addToCart = () => {
    const key = `${product._id}_${selectedVariant.label}`;

    setOrders((prev) => ({
      ...prev,
      [key]: {
        itemId: product._id,
        name: product.name,
        variant: selectedVariant.label,
        price: selectedVariant.price,
        qty,
        image: product.images?.[0], // ✅ ADD THIS
      },
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* ✅ LEFT IMAGE */}
        <div className="w-full">
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="w-full h-[420px] md:h-[520px] object-cover rounded-xl block"
          />
        </div>

        {/* ✅ RIGHT DETAILS */}
        <div className="w-full">
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>

          <div className="text-xl font-md mb-4">
            {(() => {
              const original =
                selectedVariant?.originalPrice ?? selectedVariant?.price;
              const discounted =
                selectedVariant?.discountedPrice ?? selectedVariant?.price;
              const hasDiscount = discounted < original;

              return hasDiscount ? (
                <div className="flex items-center gap-3">
                  <span className="text-green-700 font-bold text-xl">
                    {formatPrice(discounted)}
                  </span>
                  <span className="text-gray-400 line-through text-base">
                    {formatPrice(original)}
                  </span>
                  {productWithOffer?.offer && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">
                      {productWithOffer.offer.type === "percent"
                        ? `${productWithOffer.offer.value}% OFF`
                        : `$${productWithOffer.offer.value} OFF`}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-xl font-md mb-4">
                  {formatPrice(original)}
                </span>
              );
            })()}
          </div>

          <p className="text-gray-600 mb-2">{product.description}</p>

          {/* ✅ SERVING INFO (from backend) */}
          {product.servingInfo && (
            <p className="text-sm  text-gray-500 mb-5 whitespace-pre-line">
              {product.servingInfo}
            </p>
          )}

          {/* PREORDER NOTICE */}
          {product.preorder?.enabled && (
            <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-sm text-amber-800 font-medium">
                *Kindly place your order at least{" "}
                <span className="font-semibold">
                  {product.preorder.minDays} days
                </span>{" "}
                in advance.
              </p>
            </div>
          )}

          {/* VARIANTS */}
          <div className="mb-6">
            <p className="font-medium mb-2">Select Variant</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.label}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-4 py-2 rounded-full border text-sm transition ${
                    selectedVariant.label === v.label
                      ? "bg-[#1E3A8A] text-white border-[#1E3A8A]"
                      : "bg-white hover:border-gray-400"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* QTY */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="border p-2 rounded"
            >
              <FiMinus />
            </button>

            <span className="font-medium">{qty}</span>

            <button
              onClick={() => setQty((q) => q + 1)}
              className="border p-2 rounded"
            >
              <FiPlus />
            </button>
          </div>

          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-[#1E3A8A] text-white py-3 rounded-full"
          >
            ADD TO CART
          </button>
        </div>

        {/* ✅ Drawer */}
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </div>
  );
};

export default ProductDetail;
