import { useState } from 'react';
import type { Order, OrderStatus } from '../lib/types';

interface OrderFormProps {
  statuses: OrderStatus[];
  initial?: Order;
  onSave: (payload: {
    article: string;
    statusId: number;
    pickupAddress: string;
    orderDate: string;
    issueDate: string;
  }) => Promise<void>;
  onClose: () => void;
}

export function OrderForm({ statuses, initial, onSave, onClose }: OrderFormProps) {
  const [article, setArticle] = useState(initial?.article ?? '');
  const [statusId, setStatusId] = useState(initial?.status_id ?? statuses[0]?.id ?? 1);
  const [pickupAddress, setPickupAddress] = useState(initial?.pickup_address ?? '');
  const [orderDate, setOrderDate] = useState(initial?.order_date?.slice(0, 10) ?? '');
  const [issueDate, setIssueDate] = useState(initial?.issue_date?.slice(0, 10) ?? '');

  function handleArticleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setArticle(event.target.value);
  }

  function handleStatusChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    setStatusId(Number(event.target.value));
  }

  function handlePickupAddressChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setPickupAddress(event.target.value);
  }

  function handleOrderDateChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setOrderDate(event.target.value);
  }

  function handleIssueDateChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setIssueDate(event.target.value);
  }

  function handleSaveClick(): void {
    void onSave({ article, statusId, pickupAddress, orderDate, issueDate });
  }

  return (
    <div className="modal-backdrop">
      <section className="modal">
        <h2>{initial ? 'Редактирование заказа' : 'Добавление заказа'}</h2>
        <label>
          Артикул
          <input value={article} onChange={handleArticleChange} />
        </label>
        <label>
          Статус
          <select value={statusId} onChange={handleStatusChange}>
            {statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Адрес пункта выдачи
          <input value={pickupAddress} onChange={handlePickupAddressChange} />
        </label>
        <label>
          Дата заказа
          <input type="date" value={orderDate} onChange={handleOrderDateChange} />
        </label>
        <label>
          Дата выдачи
          <input type="date" value={issueDate} onChange={handleIssueDateChange} />
        </label>
        <div className="modal-actions">
          <button type="button" onClick={handleSaveClick}>
            Сохранить
          </button>
          <button type="button" onClick={onClose}>
            Отмена
          </button>
        </div>
      </section>
    </div>
  );
}
