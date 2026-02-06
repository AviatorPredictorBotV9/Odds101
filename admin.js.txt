async function load() {
  const res = await fetch("/api/payments");
  const data = await res.json();

  list.innerHTML = "";
  data.forEach(p => {
    const d = document.createElement("div");
    d.className = "box";
    d.innerHTML = `
      <p>${p.phone}</p>
      <p>${p.method}</p>
      <img src="${p.image}" width="100">
      <p>Status: ${p.status}</p>
      <button onclick="update('${p.id}','Approved')">Approve</button>
      <button onclick="update('${p.id}','Rejected')">Reject</button>
    `;
    list.appendChild(d);
  });
}
async function update(id, status) {
  await fetch("/api/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status })
  });
  load();
}
load();
