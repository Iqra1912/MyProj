import { Link } from "react-router-dom";

export default function HeroPage() {
  return (
    <div>

      <h1>Sales Dashboard</h1>
      <p>Upload your data and analyze sales performance.</p>

      <Link to="/login">
        <button>Login</button>
      </Link>

    </div>
  );
}
