async function signup() {
  await fetch("/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: suEmail.value, password: suPass.value })
  });
  alert("Account created");
}

async function login() {
  const r = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: liEmail.value, password: liPass.value })
  });
  const d = await r.json();
  if (d.status === "success") {
    location.href = d.role === "admin" ? "admin.html" : "/";
  } else alert("Invalid login");
}
