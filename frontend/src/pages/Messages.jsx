import { useEffect, useState } from "react";
import { getNotifications, markNotificationAsRead } from "../api/notifications.api";
import Card from "../components/ui/Card";

function Messages() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    getNotifications()
      .then((res) => setNotifications(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleMarkRead = async (id) => {
    setNotifications((list) => list.map((n) => (n._id === id ? { ...n, read: true } : n)));
    try {
      await markNotificationAsRead(id);
    } catch {
      load();
    }
  };

  return (
    <div>
      <h1 className="mb-1.5 text-[22px]">Messages</h1>
      <p className="mb-7 text-[13.5px] text-ink/60">
        Updates about your goals land here.
      </p>

      {loading && <p className="text-ink/60">Loading…</p>}

      {!loading && notifications.length === 0 && (
        <Card>
          <p className="text-[13.5px] text-ink/60">You&rsquo;re all caught up.</p>
        </Card>
      )}

      <div className="flex flex-col gap-2.5">
        {notifications.map((n) => (
          <div
            key={n._id}
            className={`flex items-start justify-between gap-4 rounded-xl border-[1.5px] px-5 py-4 ${
              n.read ? "border-ink/15 bg-white" : "border-marigold bg-marigold-light/40"
            }`}
          >
            <div>
              <p className="text-[13.5px] font-medium text-ink">{n.message}</p>
              <p className="mt-1 text-[11.5px] text-ink/50">
                {new Date(n.createdAt).toLocaleDateString()}
              </p>
            </div>
            {!n.read && (
              <button
                type="button"
                onClick={() => handleMarkRead(n._id)}
                className="shrink-0 text-[12px] font-semibold text-crimson"
              >
                Mark read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Messages;
