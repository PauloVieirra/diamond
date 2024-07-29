import React, { useState, useContext } from 'react';
import { StyleContext } from '../../context/StyleContext';
import './styles.css';

const PaymentPage = () => {
    const { darkMode } = useContext(StyleContext);
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expirationDate: '',
    cvv: '',
    pixKey: '',
    boletoData: '',
  });
  
  const plans = [
    {
      title: 'Mensal',
      price: 'R$ 29,90',
      description: 'Pagamento mensal, cancele a qualquer momento.',
    },
    {
      title: 'Trimestral',
      price: 'R$ 79,90',
      description: '3 meses de acesso, economize 10%!',
    },
    {
      title: 'Semestral',
      price: 'R$ 149,90',
      description: '6 meses de acesso, economize 20%!',
    },
    {
      title: 'Anual',
      price: 'R$ 249,90',
      description: '12 meses de acesso, economize 30%!',
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Payment Data:', formData);
  };

  return (
    <main className={`payment-page ${darkMode ? 'dark-mode' : 'light-mode'}`}>
    <div>
      <div className="payment-plans">
        <h2>Escolha seu Plano</h2>
        <div className="cards-container">
          {plans.map((plan, index) => (
            <div className="card" key={index}>
              <h3>{plan.title}</h3>
              <p className="price">{plan.price}</p>
              <p>{plan.description}</p>
              <button>Selecionar</button>
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="payment-methods">
          <label>
            <input
              type="radio"
              value="creditCard"
              checked={paymentMethod === 'creditCard'}
              onChange={handlePaymentMethodChange}
            />
            Cartão de Crédito
          </label>
          <label>
            <input
              type="radio"
              value="pix"
              checked={paymentMethod === 'pix'}
              onChange={handlePaymentMethodChange}
            />
            PIX
          </label>
          <label>
            <input
              type="radio"
              value="boleto"
              checked={paymentMethod === 'boleto'}
              onChange={handlePaymentMethodChange}
            />
            Boleto
          </label>
        </div>

        {paymentMethod === 'creditCard' && (
          <div className="creditfields">
            <input
              type="text"
              name="cardNumber"
              placeholder="Número do Cartão"
              value={formData.cardNumber}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="cardName"
              placeholder="Nome no Cartão"
              value={formData.cardName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="expirationDate"
              placeholder="Validade (MM/AA)"
              value={formData.expirationDate}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="cvv"
              placeholder="CVV"
              value={formData.cvv}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {paymentMethod === 'pix' && (
          <div className="pix-fields">
            <input
              type="text"
              name="pixKey"
              placeholder="Chave PIX"
              value={formData.pixKey}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {paymentMethod === 'boleto' && (
          <div className="boleto-fields">
            <input
              type="text"
              name="boletoData"
              placeholder="Dados do Boleto"
              value={formData.boletoData}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className='footpay'>
             <button type="submit">Pagar</button>
        </div>
       
      </form>
    </div>
    </main>
  );
};

export default PaymentPage;
