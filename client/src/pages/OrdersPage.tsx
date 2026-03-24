import { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { OrderForm } from '../components/OrderForm';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth-context';
import type { Order, OrderStatus } from '../lib/types';

export function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [statuses, setStatuses] = useState<OrderStatus[]>([]);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const canManage = user?.role === 'admin';
  const canAccess = user?.role === 'manager' || user?.role === 'admin';

  function handleOpenCreateModal(): void {
    setIsCreateOpen(true);
  }

  function handleCloseCreateModal(): void {
    setIsCreateOpen(false);
  }

  function handleCloseEditModal(): void {
    setEditingOrder(null);
  }

  function handleEditOrder(order: Order): void {
    setEditingOrder(order);
  }

  function createEditOrderHandler(order: Order): () => void {
    return () => {
      handleEditOrder(order);
    };
  }

  async function handleDeleteOrder(orderId: number): Promise<void> {
    try {
      await api.deleteOrder(orderId);
      await loadOrders();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Не удалось удалить заказ');
    }
  }

  function createDeleteOrderHandler(orderId: number): () => void {
    return () => {
      void handleDeleteOrder(orderId);
    };
  }

  async function handleCreateOrder(payload: {
    article: string;
    statusId: number;
    pickupAddress: string;
    orderDate: string;
    issueDate: string;
  }): Promise<void> {
    await api.createOrder(payload);
    setIsCreateOpen(false);
    await loadOrders();
  }

  async function handleUpdateOrder(payload: {
    article: string;
    statusId: number;
    pickupAddress: string;
    orderDate: string;
    issueDate: string;
  }): Promise<void> {
    if (!editingOrder) {
      return;
    }

    await api.updateOrder(editingOrder.id, payload);
    setEditingOrder(null);
    await loadOrders();
  }

  const loadOrders = useCallback(async (): Promise<void> => {
    try {
      const [ordersData, statusesData] = await Promise.all([api.getOrders(), api.getOrderStatuses()]);
      setOrders(ordersData);
      setStatuses(statusesData);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Не удалось загрузить заказы');
    }
  }, []);

  useEffect(() => {
    if (canAccess) {
      void loadOrders();
    }
  }, [canAccess, loadOrders]);

  if (!canAccess) {
    return <Navigate to="/products" replace />;
  }

  return (
    <section>
      <h2>Список заказов</h2>
      {canManage && (
        <div className="toolbar">
          <button type="button" onClick={handleOpenCreateModal}>
            Добавить заказ
          </button>
        </div>
      )}
      {errorMessage && <div className="error-box">{errorMessage}</div>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Артикул</th>
              <th>Статус</th>
              <th>Адрес пункта выдачи</th>
              <th>Дата заказа</th>
              <th>Дата выдачи</th>
              {canManage && <th>Действия</th>}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.article}</td>
                <td>{order.status_name}</td>
                <td>{order.pickup_address}</td>
                <td>{new Date(order.order_date).toLocaleDateString()}</td>
                <td>{new Date(order.issue_date).toLocaleDateString()}</td>
                {canManage && (
                  <td>
                    <button type="button" onClick={createEditOrderHandler(order)}>
                      Редактировать
                    </button>
                    <button type="button" className="danger" onClick={createDeleteOrderHandler(order.id)}>
                      Удалить
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isCreateOpen && (
        <OrderForm
          statuses={statuses}
          onSave={handleCreateOrder}
          onClose={handleCloseCreateModal}
        />
      )}

      {editingOrder && (
        <OrderForm
          statuses={statuses}
          initial={editingOrder}
          onSave={handleUpdateOrder}
          onClose={handleCloseEditModal}
        />
      )}
    </section>
  );
}
