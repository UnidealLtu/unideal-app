// Placeholder login page. Not connected to any authentication yet.
export default function LoginPage() {
  return (
    <form className="form form-centered" onSubmit={(e) => e.preventDefault()}>
      <h1>Log in</h1>
      <label>Email<input type="email" autoComplete="email" /></label>
      <label>Password<input type="password" autoComplete="current-password" /></label>
      <button type="submit">Log in</button>
    </form>
  );
}
