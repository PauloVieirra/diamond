import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Aponta para o servidor backend
  headers: {
    'Content-Type': 'application/json'
  }
});

export const createPayment = async (customerId, amount) => {
  try {
    const response = await api.post('/payments', {
      customer: customerId,
      billingType: 'BOLETO',
      dueDate: '2024-07-30', // Data de vencimento do boleto
      value: amount,
      description: 'Pagamento de teste'
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    throw error;
  }
};

export const createCustomer = async (customerData) => {
  try {
    const response = await api.post('/customers', customerData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    throw error;
  }
};
