import React, { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'

interface FAQItem {
  question: string
  answer: string
  category: string
}

export const FAQPage: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const faqItems: FAQItem[] = [
    {
      category: "Getting Started",
      question: "What is Bhandare ki Jaankari?",
      answer: "A platform to find and share information about free community meals (bhandaras) in your area."
    },
    {
      category: "Getting Started",
      question: "What is a Bhandara?",
      answer: "A free community meal, typically organized by temples, gurudwaras, or community groups as an act of service."
    },
    {
      category: "Using the Platform",
      question: "How do I find bhandaras near me?",
      answer: "Visit our homepage to see all active listings with location details, timing, and directions."
    },
    {
      category: "Using the Platform",
      question: "Do I need an account to view bhandaras?",
      answer: "No account needed to view listings. Sign in with Google only if you want to post bhandara information."
    },
    {
      category: "Posting",
      question: "How do I post a bhandara?",
      answer: "Click 'Add Bhandara', sign in with Google, and fill out the form with location, timing, and menu details."
    },
    {
      category: "Posting",
      question: "Why do listings expire after 24 hours?",
      answer: "Bhandaras are time-sensitive events. Auto-expiry ensures all information stays current and relevant."
    },
    {
      category: "Safety",
      question: "How to stay safe when attending bhandaras?",
      answer: "Verify location and timing beforehand, go in groups when possible, and respect organizers and cultural practices."
    },
    {
      category: "Contact",
      question: "How do I report inappropriate content?",
      answer: "Contact us through our contact page to report any false, misleading, or inappropriate content."
    }
  ]

  const categories = Array.from(new Set(faqItems.map(item => item.category)))

  return (
    <div className="app-background" style={{ minHeight: '100vh' }}>
      {/* Navbar */}
      <Navbar showForm={false} onToggleForm={() => {}} />
      
      <div className="container" style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '40px 20px' 
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <HelpCircle size={32} style={{ color: '#ff6b35' }} />
            <h1 style={{ 
              color: '#fff', 
              fontSize: '32px',
              fontWeight: '700',
              margin: 0
            }}>
              Frequently Asked Questions
            </h1>
          </div>
          <p style={{ 
            color: '#ccc', 
            margin: 0,
            fontSize: '16px'
          }}>
            Find answers to common questions about using our platform
          </p>
        </div>

        {/* FAQ Categories */}
        {categories.map(category => (
          <div key={category} style={{
            background: 'rgba(0, 0, 0, 0.8)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <h2 style={{ 
              color: '#ff6b35', 
              marginBottom: '20px',
              fontSize: '24px',
              fontWeight: '600'
            }}>
              {category}
            </h2>
            
            {faqItems
              .filter(item => item.category === category)
              .map((item, index) => {
                const globalIndex = faqItems.indexOf(item)
                const isOpen = openItems.includes(globalIndex)
                
                return (
                  <div key={globalIndex} style={{
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    overflow: 'hidden'
                  }}>
                    <button
                      onClick={() => toggleItem(globalIndex)}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: 'none',
                        padding: '16px 20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span style={{ 
                        color: '#fff',
                        fontWeight: '500',
                        textAlign: 'left',
                        fontSize: '16px'
                      }}>
                        {item.question}
                      </span>
                      {isOpen ? (
                        <ChevronUp size={20} style={{ color: '#ff6b35' }} />
                      ) : (
                        <ChevronDown size={20} style={{ color: '#ff6b35' }} />
                      )}
                    </button>
                    
                    {isOpen && (
                      <div style={{
                        padding: '16px 20px',
                        background: 'rgba(0, 0, 0, 0.3)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        <p style={{
                          color: '#ccc',
                          lineHeight: '1.6',
                          margin: 0
                        }}>
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        ))}

        {/* Contact Section */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#ff6b35', marginBottom: '12px' }}>Still have questions?</h3>
          <p style={{ color: '#ccc', marginBottom: '16px' }}>
            Can't find the answer you're looking for? We're here to help!
          </p>
          <Link
            to="/contact"
            className="btn-primary"
            style={{
              padding: '12px 24px',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
