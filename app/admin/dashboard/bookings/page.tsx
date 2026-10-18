import { getDb } from '@/lib/db';
import BookingStatus from '@/components/admin/BookingStatus';

export const dynamic = 'force-dynamic';

type Booking = {
  id: number;
  booking_code: string;
  service_name: string;
  vehicle_type: string;
  booking_date: string;
  booking_time: string;
  name: string;
  phone: string;
  status: string;
  created_at: string;
};

export default function BookingsAdminPage() {
  const db = getDb();
  const rows = db.prepare('SELECT id, booking_code, service_name, vehicle_type, booking_date, booking_time, name, phone, status, created_at FROM bookings ORDER BY datetime(created_at) DESC, id DESC').all() as Booking[];

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Customer Bookings ({rows.length})</h1>
          <p>Review customer requests, change status, and confirm appointment slots.</p>
        </div>
      </div>
      <div className="admin-card">
        {rows.length === 0 ? (
          <p className="admin-empty">No booking requests recorded yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Booking Code</th>
                <th>Customer Name</th>
                <th>Phone Number</th>
                <th>Service & Vehicle</th>
                <th>Scheduled Slot</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <strong style={{ color: '#D71920' }}>{row.booking_code}</strong>
                  </td>
                  <td><strong>{row.name}</strong></td>
                  <td>{row.phone}</td>
                  <td>
                    <span>{row.service_name}</span>
                    <span style={{ display: 'block', fontSize: 11, color: '#626873' }}>{row.vehicle_type}</span>
                  </td>
                  <td>
                    <span>{row.booking_date}</span>
                    <span style={{ display: 'block', fontSize: 11, color: '#626873' }}>{row.booking_time}</span>
                  </td>
                  <td>
                    <BookingStatus id={row.id} status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
