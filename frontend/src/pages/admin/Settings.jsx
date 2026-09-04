import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="mb-1.5 text-[22px]">Settings</h1>
      <p className="mb-7 text-[13.5px] text-ink/60">Your account details.</p>

      <Card className="max-w-420px">
        <div className="mb-4">
          <div className="text-[11.5px] font-semibold tracking-[0.06em] text-ink/50 uppercase">
            Name
          </div>
          <div className="text-[15px] text-ink">{user?.name}</div>
        </div>
        <div className="mb-4">
          <div className="text-[11.5px] font-semibold tracking-[0.06em] text-ink/50 uppercase">
            Email
          </div>
          <div className="text-[15px] text-ink">{user?.email}</div>
        </div>
        {user?.phone && (
          <div className="mb-4">
            <div className="text-[11.5px] font-semibold tracking-[0.06em] text-ink/50 uppercase">
              Phone
            </div>
            <div className="text-[15px] text-ink">{user.phone}</div>
          </div>
        )}
        <div className="mb-6">
          <div className="text-[11.5px] font-semibold tracking-[0.06em] text-ink/50 uppercase">
            Role
          </div>
          <div className="text-[15px] text-ink capitalize">{user?.role}</div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          Log out
        </Button>
      </Card>
    </div>
  );
}

export default Settings;
