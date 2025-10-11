// Razorpay Payment Integration Service
import apiService from './api';

class RazorpayService {
  constructor() {
    this.isLoaded = false;
    this.loadingPromise = null;
  }

  /**
   * Load Razorpay script dynamically
   */
  loadRazorpayScript() {
    if (this.isLoaded) {
      return Promise.resolve(true);
    }

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      
      script.onload = () => {
        this.isLoaded = true;
        this.loadingPromise = null;
        resolve(true);
      };
      
      script.onerror = () => {
        this.loadingPromise = null;
        reject(new Error('Failed to load Razorpay SDK'));
      };
      
      document.body.appendChild(script);
    });

    return this.loadingPromise;
  }

  /**
   * Create Razorpay order
   */
  async createOrder(orderData) {
    try {
      const response = await apiService.request('/payments/create-order', {
        method: 'POST',
        body: JSON.stringify(orderData)
      });
      return response;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  }

  /**
   * Verify Razorpay payment
   */
  async verifyPayment(paymentData) {
    try {
      const response = await apiService.request('/payments/verify', {
        method: 'POST',
        body: JSON.stringify(paymentData)
      });
      return response;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }

  /**
   * Open Razorpay checkout
   */
  async openCheckout(options, orderData) {
    try {
      // Load Razorpay script
      await this.loadRazorpayScript();

      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded');
      }

      // Create Razorpay order
      const razorpayOrder = await this.createOrder(orderData);

      return new Promise((resolve, reject) => {
        const rzpOptions = {
          key: razorpayOrder.key_id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: options.name || 'SAPTNOVA Ayurveda',
          description: options.description || 'Order Payment',
          image: options.logo || '/images/logo.png',
          order_id: razorpayOrder.order_id,
          handler: async (response) => {
            try {
              // Verify payment on backend
              const verification = await this.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_data: orderData
              });
              resolve(verification);
            } catch (error) {
              reject(error);
            }
          },
          prefill: {
            name: options.prefill?.name || '',
            email: options.prefill?.email || '',
            contact: options.prefill?.phone || ''
          },
          notes: options.notes || {},
          theme: {
            color: options.theme?.color || '#1a4d3b'
          },
          modal: {
            ondismiss: () => {
              reject(new Error('Payment cancelled by user'));
            }
          }
        };

        const rzp = new window.Razorpay(rzpOptions);
        
        rzp.on('payment.failed', (response) => {
          reject(new Error(response.error.description || 'Payment failed'));
        });

        rzp.open();
      });
    } catch (error) {
      console.error('Razorpay checkout error:', error);
      throw error;
    }
  }

  /**
   * Process payment for order
   */
  async processPayment(orderData, customerInfo) {
    const options = {
      name: 'SAPTNOVA Ayurveda',
      description: `Order Payment - ${orderData.items?.length || 0} items`,
      prefill: {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone
      },
      notes: {
        order_id: orderData.order_id || '',
        customer_email: customerInfo.email
      },
      theme: {
        color: '#1a4d3b'
      }
    };

    return await this.openCheckout(options, orderData);
  }
}

// Create singleton instance
const razorpayService = new RazorpayService();

export default razorpayService;
