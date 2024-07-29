import React, { useState } from 'react';
import { createCustomer, createPayment } from './api';

const PaymentPage = () => {
  const [paymentLink, setPaymentLink] = useState('');
  const [customerId, setCustomerId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreateCustomerAndPayment = async () => {
    setLoading(true);
    try {
      const customerData = {
        name: 'Nome do Cliente',
        email: 'cliente@example.com',
        phone: '11999999999'
      };
      const customer = await createCustomer(customerData);
      setCustomerId(customer.id);
      const amount = 100; // Valor estático do item
      const payment = await createPayment(customer.id, amount);
      setPaymentLink(payment.invoiceUrl); // Link do boleto gerado
    } catch (error) {
      console.error('Erro ao criar cliente ou pagamento:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Item para Compra</h1>
      <p>Preço: R$ 100,00</p>
      <button onClick={handleCreateCustomerAndPayment} disabled={loading}>
        {loading ? 'Processando...' : 'Efetuar Pagamento'}
      </button>
      {paymentLink && (
        <div>
          <p>Pagamento criado com sucesso!</p>
          <a href={paymentLink} target="_blank" rel="noopener noreferrer">Clique aqui para pagar</a>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
