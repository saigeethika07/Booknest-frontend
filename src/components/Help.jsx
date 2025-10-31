import React, { useState } from 'react';
const handleContactSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactForm)
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert(data.message);
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } else {
      alert('Error sending message. Please try again.');
    }
  } catch (error) {
    console.error('Contact form error:', error);
    alert('Error sending message. Please try again.');
  }
};
const Help = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqs = [
    {
      question: "How do I place an order?",
      answer: "Simply browse our book collection, add books to your cart, and proceed to checkout. You'll need to create an account or login to complete your purchase."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for larger orders."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days. International shipping may take 7-14 business days."
    },
    {
      question: "Can I return a book?",
      answer: "Yes, we accept returns within 30 days of purchase. Books must be in original condition. Please contact our support team to initiate a return."
    },
    {
      question: "Do you offer ebook versions?",
      answer: "Currently, we focus on physical books. However, we're working on adding ebook options in the near future. Stay tuned!"
    }
  ];

  const handleFAQToggle = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you within 24 hours.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '1200px', 
      margin: '0 auto' 
    }}>
      <h1 style={{ 
        color: '#e91e63', 
        fontSize: '2.5rem', 
        marginBottom: '2rem',
        fontFamily: 'Georgia, serif'
      }}>
        Help & Support
      </h1>

      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Frequently Asked Questions</h2>
        {faqs.map((faq, index) => (
          <div key={index} style={{
            background: 'white',
            marginBottom: '1rem',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <button 
              onClick={() => handleFAQToggle(index)}
              style={{
                width: '100%',
                padding: '1.5rem',
                background: 'none',
                border: 'none',
                textAlign: 'left',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                color: '#333',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              {faq.question}
              <span>{openFAQ === index ? '−' : '+'}</span>
            </button>
            {openFAQ === index && (
              <div style={{
                padding: '1.5rem',
                background: '#f8f9fa',
                color: '#666',
                lineHeight: '1.6',
                borderTop: '1px solid #e0e0e0'
              }}>
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Contact Us</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>Can't find what you're looking for? Send us a message!</p>
        
        <form onSubmit={handleContactSubmit}>
          <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={contactForm.name}
              onChange={handleContactChange}
              required
              style={{
                padding: '1rem',
                border: '2px solid #e0e0e0',
                borderRadius: '5px',
                fontSize: '1rem'
              }}
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={contactForm.email}
              onChange={handleContactChange}
              required
              style={{
                padding: '1rem',
                border: '2px solid #e0e0e0',
                borderRadius: '5px',
                fontSize: '1rem'
              }}
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={contactForm.subject}
              onChange={handleContactChange}
              required
              style={{
                padding: '1rem',
                border: '2px solid #e0e0e0',
                borderRadius: '5px',
                fontSize: '1rem'
              }}
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={contactForm.message}
              onChange={handleContactChange}
              required
              style={{
                padding: '1rem',
                border: '2px solid #e0e0e0',
                borderRadius: '5px',
                minHeight: '150px',
                resize: 'vertical',
                fontFamily: 'inherit',
                fontSize: '1rem'
              }}
            />
          </div>
          <button type="submit" style={{
            background: '#e91e63',
            color: 'white',
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}>
            Send Message
          </button>
        </form>
      </div>

      <div style={{ 
        marginTop: '3rem', 
        textAlign: 'center', 
        color: '#666',
        background: 'white',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '1rem', color: '#333' }}>Customer Support</h3>
        <p>📧 Email: support@booknest.com</p>
        <p>📞 Phone: 1-800-BOOKNEST</p>
        <p>🕒 Hours: Monday-Friday, 9AM-6PM EST</p>
      </div>
    </div>
  );
};

export default Help;