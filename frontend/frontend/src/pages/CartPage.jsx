import React, { useState } from 'react';
import { Plus, Minus, Trash2, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../pages/cart.css';


export function CartPage() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const handleCheckout = async () => {
    if (!user) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      setShowPayment(true);
      setIsProcessing(false);
    }, 2000);
  };

  const handlePayment = () => {
    alert('Order placed successfully! You will receive a confirmation email shortly.');
    clearCart();
    setShowPayment(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="text-gray-400 mb-4">
              <CreditCard className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some delicious items from our restaurants!</p>
            <Link
              to="/restaurants"
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Browse Restaurants
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-gray-600 text-sm">${item.price}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-600 transition-colors mt-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>$2.99</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${(total * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between font-semibold text-gray-800">
                    <span>Total</span>
                    <span>${(total + 2.99 + total * 0.08).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {!user ? (
                <Link
                  to="/login"
                  className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors text-center block"
                >
                  Login to Checkout
                </Link>
              ) : (
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Payment Modal */}
        {showPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-4">Payment</h3>
              <div className="mb-6">
                <p className="text-gray-600 mb-2">Total Amount: ${(total + 2.99 + total * 0.08).toFixed(2)}</p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Demo Payment:</strong> This is a demo integration with e-sewa API. 
                    In production, you would integrate with the actual e-sewa payment gateway.
                  </p>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handlePayment}
                  className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Pay with e-sewa (Demo)
                </button>
                <button
                  onClick={() => setShowPayment(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
